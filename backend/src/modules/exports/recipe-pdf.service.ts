import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { MediaService } from '../media/media.service';
import { RecipeDetailItem } from '../recipes/recipes.service';

type Pdf = InstanceType<typeof PDFDocument>;

const DIFFICULTY_LABELS: Record<RecipeDetailItem['difficulty'], string> = {
  EASY: 'Fácil',
  MEDIUM: 'Media',
  HARD: 'Difícil',
};

const SOURCE_LABELS: Record<RecipeDetailItem['sourceType'], string> = {
  REFERENCE: 'Receta de referencia documental',
  INTERVIEW: 'Recopilada en trabajo de campo',
  COMMUNITY: 'Aporte de la comunidad',
};

// Escala zinc, igual que la interfaz
const INK = '#18181b';
const MUTED = '#71717a';
const RULE = '#e4e4e7';
const MARGIN = 56;
const IMAGE_TIMEOUT_MS = 8000;
// Marco de la foto: ancho del contenido en proporcion 16:9
const COVER_RATIO = 9 / 16;

const dateFormatter = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });

export interface CookbookOwner {
  name: string;
}

@Injectable()
export class RecipePdfService {
  private readonly logger = new Logger(RecipePdfService.name);
  private readonly frontendUrl: string;

  constructor(
    configService: ConfigService,
    private readonly mediaService: MediaService,
  ) {
    this.frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');
  }

  async buildRecipe(recipe: RecipeDetailItem): Promise<Buffer> {
    const doc = this.createDocument(recipe.title);
    const done = this.collect(doc);
    await this.writeRecipe(doc, recipe, await this.loadCover(recipe.coverImageUrl));
    doc.end();
    return done;
  }

  async buildCookbook(owner: CookbookOwner, recipes: RecipeDetailItem[]): Promise<Buffer> {
    const doc = this.createDocument(`Recetario de ${owner.name}`);
    const done = this.collect(doc);
    const covers = await Promise.all(recipes.map((r) => this.loadCover(r.coverImageUrl)));

    this.writeCookbookCover(doc, owner, recipes);
    for (const [index, recipe] of recipes.entries()) {
      doc.addPage();
      await this.writeRecipe(doc, recipe, covers[index]);
    }

    doc.end();
    return done;
  }

  private createDocument(title: string): Pdf {
    return new PDFDocument({
      size: 'LETTER',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
      info: { Title: title, Author: 'Memoria del Comal', Creator: 'memoriadelcomal.com' },
    });
  }

  private collect(doc: Pdf): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });
  }

  // PDFKit no lee WebP: se convierte a JPEG; si falla, el PDF sale sin foto
  private async loadCover(url: string | null): Promise<Buffer | null> {
    if (!url || !this.mediaService.isOwnRecipeImage(url)) return null;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) });
      if (!response.ok) return null;
      const source = Buffer.from(await response.arrayBuffer());
      // Se recorta al marco aqui porque PDFKit escala pero no recorta
      return await sharp(source)
        .rotate()
        .resize({ width: 1200, height: Math.round(1200 * COVER_RATIO), fit: 'cover', position: 'attention' })
        .jpeg({ quality: 80 })
        .toBuffer();
    } catch (error) {
      this.logger.warn(`No se pudo incluir la foto ${url}: ${(error as Error).message}`);
      return null;
    }
  }

  private writeCookbookCover(doc: Pdf, owner: CookbookOwner, recipes: RecipeDetailItem[]): void {
    const width = this.contentWidth(doc);
    doc.font('Helvetica').fontSize(10).fillColor(MUTED).text('Memoria del Comal', { width });
    doc.moveDown(6);
    doc.font('Helvetica-Bold').fontSize(30).fillColor(INK).text('Mi recetario', { width });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(13).fillColor(MUTED).text(owner.name, { width });
    doc.fontSize(10).text(`${recipes.length} recetas guardadas · ${dateFormatter.format(new Date())}`, { width });

    doc.moveDown(3);
    doc.font('Helvetica-Bold').fontSize(12).fillColor(INK).text('Contenido', { width });
    doc.moveDown(0.5);
    recipes.forEach((recipe, index) => {
      doc.font('Helvetica').fontSize(11).fillColor(INK).text(`${index + 1}. ${recipe.title}`, { width, continued: true });
      doc.fillColor(MUTED).text(`  ${recipe.originRegion}`);
    });
  }

  private async writeRecipe(doc: Pdf, recipe: RecipeDetailItem, cover: Buffer | null): Promise<void> {
    const width = this.contentWidth(doc);

    doc.font('Helvetica').fontSize(9).fillColor(MUTED).text('Memoria del Comal · Cocina tradicional de Jutiapa', { width });
    doc.moveDown(0.8);
    doc.font('Helvetica-Bold').fontSize(22).fillColor(INK).text(recipe.title, { width });
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(10).fillColor(MUTED).text(`${recipe.originRegion} · Por ${recipe.author.name}`, { width });

    if (cover) {
      doc.moveDown(0.8);
      const height = width * COVER_RATIO;
      this.ensureSpace(doc, height);
      const top = doc.y;
      doc.image(cover, MARGIN, top, { width, height });
      doc.y = top + height;
    }

    doc.moveDown(0.8);
    const meta = [
      `Preparación: ${recipe.prepTimeMinutes} min`,
      `Cocción: ${recipe.cookTimeMinutes} min`,
      `Porciones: ${recipe.servings}`,
      `Dificultad: ${DIFFICULTY_LABELS[recipe.difficulty]}`,
    ].join('    ');
    doc.font('Helvetica').fontSize(10).fillColor(INK).text(meta, { width });
    this.rule(doc);

    doc.font('Helvetica').fontSize(11).fillColor(INK).text(recipe.description, { width, lineGap: 2 });

    this.heading(doc, 'Ingredientes');
    for (const ing of recipe.ingredients) {
      doc.font('Helvetica').fontSize(11).fillColor(INK)
        .text(`•  ${this.describeIngredient(ing)}`, { width, indent: 4, lineGap: 2 });
    }

    this.heading(doc, 'Preparación');
    // Numero en su propia columna para que el texto largo quede con sangria
    const numberWidth = 20;
    for (const step of recipe.steps) {
      this.ensureSpace(doc, 30);
      const top = doc.y;
      doc.font('Helvetica-Bold').fontSize(11).fillColor(INK).text(`${step.stepNumber}.`, MARGIN, top, { width: numberWidth });
      // Algunos autores escriben el numero dentro del paso; se quita para no duplicarlo
      doc.font('Helvetica').text(step.instruction.replace(/^\s*\d+\s*[.)-]\s*/, ''), MARGIN + numberWidth, top, {
        width: width - numberWidth,
        lineGap: 2,
      });
      doc.x = MARGIN;
      doc.moveDown(0.4);
    }

    if (recipe.sourceType !== 'COMMUNITY' && recipe.sourceName) {
      this.rule(doc);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(MUTED).text(SOURCE_LABELS[recipe.sourceType], { width });
      doc.font('Helvetica').text(`Fuente: ${recipe.sourceName}`, { width });
      if (recipe.sourceUrl) doc.text(recipe.sourceUrl, { width, link: recipe.sourceUrl });
    }

    // La licencia de la foto exige mostrar el credito donde aparezca
    if (cover && recipe.coverImageCredit) {
      this.rule(doc);
      doc.font('Helvetica').fontSize(9).fillColor(MUTED)
        .text(`Foto: ${recipe.coverImageCredit}`, { width, link: recipe.coverImageCreditUrl ?? undefined });
    }

    this.rule(doc);
    const recipeUrl = `${this.frontendUrl}/recipe/${recipe.id}`;
    doc.font('Helvetica').fontSize(9).fillColor(MUTED)
      .text(`Descargado de ${recipeUrl} el ${dateFormatter.format(new Date())}.`, { width, link: recipeUrl });
  }

  // "2 tazas de frijol"; sin cantidad numerica queda "Sal: al gusto"
  private describeIngredient(ing: RecipeDetailItem['ingredients'][number]): string {
    const amount = [ing.quantity.trim(), ing.unit.trim()].filter(Boolean).join(' ');
    const notes = ing.notes ? ` (${ing.notes})` : '';
    if (/^\d/.test(ing.quantity.trim())) return `${amount} de ${ing.name}${notes}`;
    const name = ing.name.charAt(0).toUpperCase() + ing.name.slice(1);
    return amount ? `${name}: ${amount.toLowerCase()}${notes}` : `${name}${notes}`;
  }

  private heading(doc: Pdf, text: string): void {
    doc.moveDown(1);
    this.ensureSpace(doc, 60);
    doc.font('Helvetica-Bold').fontSize(14).fillColor(INK).text(text, { width: this.contentWidth(doc) });
    doc.moveDown(0.4);
  }

  private rule(doc: Pdf): void {
    doc.moveDown(0.8);
    doc.moveTo(MARGIN, doc.y).lineTo(doc.page.width - MARGIN, doc.y).lineWidth(0.5).strokeColor(RULE).stroke();
    doc.moveDown(0.8);
  }

  // Evita que un titulo o la foto queden partidos al final de la pagina
  private ensureSpace(doc: Pdf, height: number): void {
    if (doc.y + height > doc.page.height - MARGIN) doc.addPage();
  }

  private contentWidth(doc: Pdf): number {
    return doc.page.width - MARGIN * 2;
  }
}
