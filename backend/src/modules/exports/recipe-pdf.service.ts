import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
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

// Paleta del sitio: escala arena de tailwind.config.ts, Brasa y ocre solo en la franja tejida
const INK = '#1F1A13';
const TEXT = '#2D261D';
const MUTED = '#6F6350';
const BORDER = '#E7DCC6';
const BORDER_STRONG = '#D5C7AC';
const SOFT = '#F3EBDB';
const PAPER = '#FFFCF6';
const CREAM = '#F8F1E5';
const BRAND = '#C2410C';
const OCHRE = '#D69E2E';

const MARGIN = 56;
const FOOTER_SPACE = 28;
const RADIUS = 6;
const IMAGE_TIMEOUT_MS = 8000;
// Marco de la foto: ancho del contenido en proporcion 16:9
const COVER_RATIO = 9 / 16;
const PLACEHOLDER_HEIGHT = 150;

// Fuentes y comal junto al codigo: dist/modules/exports y src/modules/exports quedan a tres niveles de backend/
const ASSETS_DIR = join(__dirname, '..', '..', '..', 'assets', 'pdf');

const dateFormatter = new Intl.DateTimeFormat('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });

export interface CookbookOwner {
  name: string;
}

interface PdfAssets {
  serif: Buffer;
  serifSemibold: Buffer;
  serifBold: Buffer;
  serifItalic: Buffer;
  comal: Buffer;
}

@Injectable()
export class RecipePdfService {
  private readonly logger = new Logger(RecipePdfService.name);
  private readonly frontendUrl: string;
  private readonly assets: PdfAssets;

  constructor(
    configService: ConfigService,
    private readonly mediaService: MediaService,
  ) {
    this.frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');
    const read = (file: string): Buffer => readFileSync(join(ASSETS_DIR, file));
    this.assets = {
      serif: read('lora-400-normal.ttf'),
      serifSemibold: read('lora-600-normal.ttf'),
      serifBold: read('lora-700-normal.ttf'),
      serifItalic: read('lora-400-italic.ttf'),
      comal: read('comal.png'),
    };
  }

  async buildRecipe(recipe: RecipeDetailItem): Promise<Buffer> {
    const doc = this.createDocument(recipe.title);
    const done = this.collect(doc);
    this.writeRecipe(doc, recipe, await this.loadCover(recipe.coverImageUrl));
    this.writeFooters(doc, 0);
    doc.end();
    return done;
  }

  async buildCookbook(owner: CookbookOwner, recipes: RecipeDetailItem[]): Promise<Buffer> {
    const doc = this.createDocument(`Recetario de ${owner.name}`);
    const done = this.collect(doc);
    const covers = await Promise.all(recipes.map((r) => this.loadCover(r.coverImageUrl)));

    const contents = this.writeCookbookCover(doc, owner, recipes);
    const startPages: number[] = [];
    for (const [index, recipe] of recipes.entries()) {
      doc.addPage();
      startPages.push(this.currentPage(doc));
      this.writeRecipe(doc, recipe, covers[index]);
    }
    this.writeContentsPages(doc, contents, startPages);

    // La portada del recetario no lleva pie
    this.writeFooters(doc, 1);
    doc.end();
    return done;
  }

  private createDocument(title: string): Pdf {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
      info: { Title: title, Author: 'Memoria del Comal', Creator: 'memoriadelcomal.com' },
    });
    doc.registerFont('Serif', this.assets.serif);
    doc.registerFont('Serif-Semibold', this.assets.serifSemibold);
    doc.registerFont('Serif-Bold', this.assets.serifBold);
    doc.registerFont('Serif-Italic', this.assets.serifItalic);
    return doc;
  }

  private collect(doc: Pdf): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });
  }

  // PDFKit no lee WebP: se convierte a JPEG; si falla, el PDF sale con el tejido en lugar de la foto
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

  // Devuelve donde quedo cada renglon del indice para escribir su pagina al final
  private writeCookbookCover(doc: Pdf, owner: CookbookOwner, recipes: RecipeDetailItem[]): { page: number; y: number }[] {
    const width = this.contentWidth(doc);
    const logoSize = 72;
    doc.image(this.assets.comal, (doc.page.width - logoSize) / 2, MARGIN + 24, { fit: [logoSize, logoSize] });
    doc.y = MARGIN + 24 + logoSize + 16;

    doc.font('Serif-Semibold').fontSize(12).fillColor(MUTED).text('Memoria del Comal', MARGIN, doc.y, { width, align: 'center' });
    doc.moveDown(0.6);
    doc.font('Serif-Bold').fontSize(32).fillColor(INK).text('Mi recetario', { width, align: 'center' });
    doc.moveDown(0.2);
    doc.font('Serif-Italic').fontSize(14).fillColor(TEXT).text(owner.name, { width, align: 'center' });
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10).fillColor(MUTED)
      .text(`${recipes.length} recetas guardadas · ${dateFormatter.format(new Date())}`, { width, align: 'center' });

    doc.moveDown(1.5);
    this.textileBand(doc, MARGIN, doc.y, width, 0.5);
    doc.y += 8 + 28;

    doc.font('Serif-Semibold').fontSize(15).fillColor(INK).text('Contenido', MARGIN, doc.y, { width });
    doc.moveDown(0.6);

    const lines: { page: number; y: number }[] = [];
    recipes.forEach((recipe, index) => {
      this.ensureSpace(doc, 22);
      const top = doc.y;
      lines.push({ page: this.currentPage(doc), y: top });
      doc.font('Serif').fontSize(11).fillColor(INK)
        .text(`${index + 1}.  ${recipe.title}`, MARGIN, top, { width: width - 140, lineBreak: false, ellipsis: true });
      doc.font('Helvetica').fontSize(9).fillColor(MUTED)
        .text(recipe.originRegion, MARGIN + width - 140, top + 2, { width: 110, align: 'right', lineBreak: false, ellipsis: true });
      doc.y = top + 16;
      doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + width, doc.y).lineWidth(0.5).strokeColor(SOFT).stroke();
      doc.y += 6;
    });
    return lines;
  }

  private writeContentsPages(doc: Pdf, lines: { page: number; y: number }[], startPages: number[]): void {
    const width = this.contentWidth(doc);
    lines.forEach((line, index) => {
      doc.switchToPage(line.page);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT)
        .text(String(startPages[index] + 1), MARGIN + width - 24, line.y + 2, { width: 24, align: 'right', lineBreak: false });
    });
    doc.switchToPage(this.currentPageCount(doc) - 1);
  }

  private writeRecipe(doc: Pdf, recipe: RecipeDetailItem, cover: Buffer | null): void {
    const width = this.contentWidth(doc);

    this.writeBrandHeader(doc);

    doc.font('Helvetica').fontSize(9).fillColor(MUTED)
      .text(`${recipe.originRegion}  •  Tradición viva`, MARGIN, doc.y, { width });
    doc.moveDown(0.3);
    doc.font('Serif-Bold').fontSize(24).fillColor(INK).text(recipe.title, { width, lineGap: 1 });
    doc.moveDown(0.25);
    doc.font('Helvetica').fontSize(10).fillColor(MUTED).text('Por ', { width, continued: true });
    doc.font('Helvetica-Bold').fillColor(TEXT).text(recipe.author.name);
    doc.moveDown(0.8);

    if (cover) {
      const height = width * COVER_RATIO;
      this.ensureSpace(doc, height);
      const top = doc.y;
      doc.save();
      doc.roundedRect(MARGIN, top, width, height, RADIUS).clip();
      doc.image(cover, MARGIN, top, { width, height });
      doc.restore();
      doc.roundedRect(MARGIN, top, width, height, RADIUS).lineWidth(0.75).strokeColor(BORDER).stroke();
      doc.y = top + height;
      // La licencia de la foto exige mostrar el credito donde aparezca
      if (recipe.coverImageCredit) {
        doc.moveDown(0.3);
        doc.font('Helvetica').fontSize(8).fillColor(MUTED)
          .text(`Foto: ${recipe.coverImageCredit}`, MARGIN, doc.y, { width, link: recipe.coverImageCreditUrl ?? undefined });
      }
    } else {
      this.coverPlaceholder(doc, recipe.title);
    }

    doc.moveDown(1);
    this.writeMeta(doc, recipe);

    if (recipe.description.trim()) {
      doc.moveDown(1);
      this.writeStory(doc, recipe.description);
    }

    this.heading(doc, 'Ingredientes');
    this.writeIngredients(doc, recipe.ingredients);

    this.heading(doc, 'Modo de preparación');
    this.writeSteps(doc, recipe.steps);

    if (recipe.sourceType !== 'COMMUNITY' && recipe.sourceName) {
      doc.moveDown(1);
      this.writeSource(doc, recipe);
    }

    doc.moveDown(1.2);
    const recipeUrl = `${this.frontendUrl}/recipe/${recipe.id}`;
    this.ensureSpace(doc, 24);
    doc.font('Helvetica').fontSize(8.5).fillColor(MUTED)
      .text(`Descargado de ${recipeUrl} el ${dateFormatter.format(new Date())}.`, MARGIN, doc.y, { width, link: recipeUrl });
  }

  // Comal, nombre y franja tejida: el mismo encabezado que el sitio
  private writeBrandHeader(doc: Pdf): void {
    const width = this.contentWidth(doc);
    const top = MARGIN - 16;
    const logo = 26;
    doc.image(this.assets.comal, MARGIN, top, { fit: [logo, logo] });
    doc.font('Serif-Semibold').fontSize(13).fillColor(INK)
      .text('Memoria del Comal', MARGIN + logo + 8, top + 6, { width: 220, lineBreak: false });
    doc.font('Helvetica').fontSize(8.5).fillColor(MUTED)
      .text('Cocina tradicional de Jutiapa', MARGIN + width - 200, top + 9, { width: 200, align: 'right', lineBreak: false });
    const bandTop = top + logo + 10;
    this.textileBand(doc, MARGIN, bandTop, width, 0.5);
    doc.x = MARGIN;
    doc.y = bandTop + 8 + 20;
  }

  // Igual que RecipeCoverPlaceholder: tejido arena, el comal, el titulo y la franja de color abajo
  private coverPlaceholder(doc: Pdf, title: string): void {
    const width = this.contentWidth(doc);
    const height = PLACEHOLDER_HEIGHT;
    this.ensureSpace(doc, height);
    const top = doc.y;

    doc.save();
    doc.roundedRect(MARGIN, top, width, height, RADIUS).clip();
    doc.rect(MARGIN, top, width, height).fill(CREAM);
    const step = 24;
    for (let x = MARGIN; x < MARGIN + width + step; x += step) {
      for (let y = top; y < top + height + step; y += step) {
        doc.polygon([x, y - 8], [x + 8, y], [x, y + 8], [x - 8, y]).lineWidth(0.6).strokeColor(BORDER).stroke();
      }
    }
    this.textileBand(doc, MARGIN, top + height - 8, width, 0.5);
    doc.restore();
    doc.roundedRect(MARGIN, top, width, height, RADIUS).lineWidth(0.75).strokeColor(BORDER).stroke();

    const logo = 44;
    const titleWidth = width - 80;
    doc.font('Serif-Semibold').fontSize(13);
    const titleHeight = doc.heightOfString(title, { width: titleWidth });
    const blockTop = top + (height - 8 - logo - 8 - titleHeight) / 2;
    doc.image(this.assets.comal, MARGIN + (width - logo) / 2, blockTop, { fit: [logo, logo] });
    doc.fillColor(TEXT).text(title, MARGIN + 40, blockTop + logo + 8, { width: titleWidth, align: 'center' });

    doc.x = MARGIN;
    doc.y = top + height;
  }

  // Cuatro datos en una tarjeta, como RecipeCookingMeta
  private writeMeta(doc: Pdf, recipe: RecipeDetailItem): void {
    const width = this.contentWidth(doc);
    const height = 46;
    this.ensureSpace(doc, height);
    const top = doc.y;
    const cells = [
      ['Preparación', `${recipe.prepTimeMinutes} min`],
      ['Cocción', `${recipe.cookTimeMinutes} min`],
      ['Rendimiento', `${recipe.servings} porciones`],
      ['Dificultad', DIFFICULTY_LABELS[recipe.difficulty]],
    ];
    const cellWidth = width / cells.length;

    doc.roundedRect(MARGIN, top, width, height, RADIUS).lineWidth(0.75).fillAndStroke(PAPER, BORDER);
    cells.forEach(([label, value], index) => {
      const x = MARGIN + index * cellWidth;
      if (index > 0) {
        doc.moveTo(x, top + 10).lineTo(x, top + height - 10).lineWidth(0.5).strokeColor(BORDER).stroke();
      }
      doc.font('Helvetica').fontSize(8.5).fillColor(MUTED).text(label, x + 14, top + 10, { width: cellWidth - 20, lineBreak: false });
      doc.font('Helvetica-Bold').fontSize(11).fillColor(INK).text(value, x + 14, top + 23, { width: cellWidth - 20, lineBreak: false });
    });
    doc.x = MARGIN;
    doc.y = top + height;
  }

  private writeStory(doc: Pdf, description: string): void {
    const width = this.contentWidth(doc);
    const padding = 14;
    const inner = width - padding * 2;
    doc.font('Serif-Semibold').fontSize(11);
    const titleHeight = doc.heightOfString('Reseña e historia', { width: inner });
    doc.font('Helvetica').fontSize(10);
    const bodyHeight = doc.heightOfString(description, { width: inner, lineGap: 2 });
    const height = padding * 2 + titleHeight + 4 + bodyHeight;

    // Una reseña de mas de una pagina va sin tarjeta para no partir el recuadro
    const fitsInPage = height < this.pageBottom(doc) - MARGIN;
    if (fitsInPage) {
      this.ensureSpace(doc, height);
      doc.roundedRect(MARGIN, doc.y, width, height, RADIUS).lineWidth(0.75).fillAndStroke(PAPER, BORDER);
    }
    const top = doc.y;
    doc.font('Serif-Semibold').fontSize(11).fillColor(INK).text('Reseña e historia', MARGIN + padding, top + padding, { width: inner });
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(10).fillColor(TEXT).text(description, MARGIN + padding, doc.y, { width: inner, lineGap: 2 });
    doc.x = MARGIN;
    if (fitsInPage) doc.y = top + height;
  }

  // Casilla, nombre y cantidad a la derecha, como IngredientChecklist; la casilla sirve para marcar en papel
  private writeIngredients(doc: Pdf, ingredients: RecipeDetailItem['ingredients']): void {
    const width = this.contentWidth(doc);
    const box = 9;
    const amountWidth = 130;
    const nameX = MARGIN + box + 10;
    const nameWidth = width - (box + 10) - amountWidth - 10;

    ingredients.forEach((ing, index) => {
      const amount = [ing.quantity.trim(), ing.unit.trim()].filter(Boolean).join(' ');
      doc.font('Helvetica-Bold').fontSize(10.5);
      const nameHeight = doc.heightOfString(this.capitalize(ing.name), { width: nameWidth });
      doc.font('Helvetica').fontSize(9);
      const notesHeight = ing.notes ? doc.heightOfString(ing.notes, { width: nameWidth }) + 1 : 0;
      const rowHeight = Math.max(nameHeight + notesHeight, 14) + 10;
      this.ensureSpace(doc, rowHeight);

      const top = doc.y;
      if (index > 0) doc.moveTo(MARGIN, top).lineTo(MARGIN + width, top).lineWidth(0.5).strokeColor(SOFT).stroke();
      doc.roundedRect(MARGIN, top + 7, box, box, 1.5).lineWidth(0.9).strokeColor(BORDER_STRONG).stroke();
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor(TEXT).text(this.capitalize(ing.name), nameX, top + 5, { width: nameWidth });
      if (ing.notes) {
        doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(ing.notes, nameX, doc.y + 1, { width: nameWidth });
      }
      if (amount) {
        doc.font('Helvetica').fontSize(9.5).fillColor(MUTED)
          .text(amount, MARGIN + width - amountWidth, top + 6, { width: amountWidth, align: 'right' });
      }
      doc.x = MARGIN;
      doc.y = top + rowHeight;
    });
  }

  // Numero en un cuadro Brasa, como PreparationSteps en el sitio
  private writeSteps(doc: Pdf, steps: RecipeDetailItem['steps']): void {
    const width = this.contentWidth(doc);
    const badge = 20;
    const textX = MARGIN + badge + 12;
    const textWidth = width - badge - 12;

    for (const step of steps) {
      // Algunos autores escriben el numero dentro del paso; se quita para no duplicarlo
      const instruction = step.instruction.replace(/^\s*\d+\s*[.)-]\s*/, '');
      doc.font('Helvetica').fontSize(10.5);
      const textHeight = doc.heightOfString(instruction, { width: textWidth, lineGap: 2.5 });
      this.ensureSpace(doc, Math.min(Math.max(textHeight, badge), 120));

      const top = doc.y;
      doc.roundedRect(MARGIN, top, badge, badge, 4).fill(BRAND);
      doc.font('Serif-Semibold').fontSize(11).fillColor('#FFFFFF')
        .text(String(step.stepNumber), MARGIN, top + 3.5, { width: badge, align: 'center', lineBreak: false });
      doc.font('Helvetica').fontSize(10.5).fillColor(TEXT).text(instruction, textX, top + 3, { width: textWidth, lineGap: 2.5 });
      doc.x = MARGIN;
      doc.y = Math.max(doc.y, top + badge) + 10;
    }
  }

  private writeSource(doc: Pdf, recipe: RecipeDetailItem): void {
    const width = this.contentWidth(doc);
    const padding = 12;
    const inner = width - padding * 2;
    const lines = [`Fuente: ${recipe.sourceName ?? ''}`, ...(recipe.sourceUrl ? [recipe.sourceUrl] : [])];
    doc.font('Helvetica-Bold').fontSize(9);
    const labelHeight = doc.heightOfString(SOURCE_LABELS[recipe.sourceType], { width: inner });
    doc.font('Helvetica').fontSize(9);
    const bodyHeight = lines.reduce((sum, line) => sum + doc.heightOfString(line, { width: inner }), 0);
    const height = padding * 2 + labelHeight + 2 + bodyHeight;
    this.ensureSpace(doc, height);

    const top = doc.y;
    doc.roundedRect(MARGIN, top, width, height, RADIUS).lineWidth(0.75).strokeColor(BORDER).stroke();
    doc.font('Helvetica-Bold').fontSize(9).fillColor(INK).text(SOURCE_LABELS[recipe.sourceType], MARGIN + padding, top + padding, { width: inner });
    doc.moveDown(0.15);
    doc.font('Helvetica').fontSize(9).fillColor(MUTED).text(lines[0], MARGIN + padding, doc.y, { width: inner });
    if (recipe.sourceUrl) {
      doc.text(recipe.sourceUrl, MARGIN + padding, doc.y, { width: inner, link: recipe.sourceUrl, underline: true });
    }
    doc.x = MARGIN;
    doc.y = top + height;
  }

  // Pie con la marca y el numero de pagina; se escribe al final porque el total se conoce hasta entonces; firstPage salta la portada
  private writeFooters(doc: Pdf, firstPage: number): void {
    const total = this.currentPageCount(doc);
    const width = this.contentWidth(doc);
    for (let page = firstPage; page < total; page++) {
      doc.switchToPage(page);
      const bottomMargin = doc.page.margins.bottom;
      // Sin margen inferior, el texto del pie no abre una pagina nueva
      doc.page.margins.bottom = 0;
      const y = doc.page.height - MARGIN + 12;
      doc.moveTo(MARGIN, y - 6).lineTo(MARGIN + width, y - 6).lineWidth(0.5).strokeColor(BORDER).stroke();
      doc.font('Serif-Semibold').fontSize(8.5).fillColor(MUTED)
        .text('Memoria del Comal', MARGIN, y, { width: width / 2, lineBreak: false });
      // Numeracion fisica, la misma que usa el indice del recetario
      doc.font('Helvetica').fontSize(8.5).fillColor(MUTED)
        .text(`Página ${page + 1} de ${total}`, MARGIN + width / 2, y + 1, { width: width / 2, align: 'right', lineBreak: false });
      doc.page.margins.bottom = bottomMargin;
    }
  }

  // Franja de TextileBand: fondo Brasa, bordes oscuros y rombo ocre; escala 0.5 = 8 pt de alto
  private textileBand(doc: Pdf, x: number, y: number, width: number, scale: number): void {
    const tile = 32 * scale;
    const height = 16 * scale;
    const p = (px: number, py: number): [number, number] => [px * scale, py * scale];
    doc.save();
    doc.rect(x, y, width, height).clip();
    doc.rect(x, y, width, height).fill(BRAND);
    doc.rect(x, y, width, 2 * scale).fill(INK);
    doc.rect(x, y + 14 * scale, width, 2 * scale).fill(INK);
    for (let tx = x; tx < x + width; tx += tile) {
      const at = ([px, py]: [number, number]): [number, number] => [tx + px, y + py];
      doc.polygon(at(p(16, 3)), at(p(25, 8)), at(p(16, 13)), at(p(7, 8))).fill(OCHRE);
      doc.polygon(at(p(16, 6)), at(p(20, 8)), at(p(16, 10)), at(p(12, 8))).fill(INK);
      doc.rect(tx, y + 7 * scale, 3 * scale, 2 * scale).fill(OCHRE);
      doc.rect(tx + 29 * scale, y + 7 * scale, 3 * scale, 2 * scale).fill(OCHRE);
    }
    doc.restore();
  }

  private heading(doc: Pdf, text: string): void {
    const width = this.contentWidth(doc);
    doc.moveDown(1.4);
    this.ensureSpace(doc, 70);
    doc.font('Serif-Semibold').fontSize(15).fillColor(INK).text(text, MARGIN, doc.y, { width });
    doc.moveDown(0.3);
    doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + width, doc.y).lineWidth(0.75).strokeColor(BORDER).stroke();
    doc.y += 4;
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Evita que un titulo, la foto o una tarjeta queden partidos al final de la pagina
  private ensureSpace(doc: Pdf, height: number): void {
    if (doc.y + height > this.pageBottom(doc)) {
      doc.addPage();
      doc.x = MARGIN;
    }
  }

  // Deja espacio para el pie de pagina
  private pageBottom(doc: Pdf): number {
    return doc.page.height - MARGIN - FOOTER_SPACE + 12;
  }

  private currentPage(doc: Pdf): number {
    return this.currentPageCount(doc) - 1;
  }

  private currentPageCount(doc: Pdf): number {
    const range = doc.bufferedPageRange();
    return range.start + range.count;
  }

  private contentWidth(doc: Pdf): number {
    return doc.page.width - MARGIN * 2;
  }
}
