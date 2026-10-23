import { config as loadEnvFile } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { and, eq, isNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import sharp from 'sharp';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as schema from '../schema';
import { recipes } from '../schema';
import { recipePhotos } from './recipe-photos';

// Asigna portadas con licencia libre (Wikimedia Commons) a recetas sin foto. Idempotente: no toca recetas con foto.
loadEnvFile({ path: '.env.local' });
loadEnvFile({ path: '.env' });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Falta la variable de entorno obligatoria ${name}. Complete backend/.env.`);
  }
  return value;
}

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const HEADERS = { 'User-Agent': 'MemoriaDelComal/1.0 (proyecto de graduacion UMG)' };
const FREE_LICENSE = /^(cc0|cc[- ]by(-sa)?[- ]?[0-9.]*|public domain|pd)/i;
const MAX_WIDTH = 1600;

interface CommonsFile {
  original: string;
  page: string;
  license: string;
  artist: string;
}

const strip = (html: string | undefined): string =>
  (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function fetchCommonsFile(title: string): Promise<CommonsFile> {
  // Se pide una version de MAX_WIDTH px: es lo que se usa y pesa mucho menos que el original
  const url = `${COMMONS_API}?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=${MAX_WIDTH}`;
  const body = (await (await fetch(url, { headers: HEADERS })).json()) as {
    query?: { pages?: Record<string, { imageinfo?: { url: string; thumburl?: string; descriptionurl: string; extmetadata?: Record<string, { value?: string }> }[] }> };
  };
  const info = Object.values(body.query?.pages ?? {})[0]?.imageinfo?.[0];
  if (!info) throw new Error(`No se encontro ${title} en Commons`);
  return {
    original: info.thumburl ?? info.url,
    page: info.descriptionurl,
    license: strip(info.extmetadata?.LicenseShortName?.value),
    artist: strip(info.extmetadata?.Artist?.value) || 'Autor desconocido',
  };
}

// Wikimedia limita las descargas seguidas: se reintenta con espera creciente
async function downloadImage(url: string): Promise<Buffer> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch(url, { headers: HEADERS });
    if (response.ok && (response.headers.get('content-type') ?? '').startsWith('image/')) {
      return Buffer.from(await response.arrayBuffer());
    }
    await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
  }
  throw new Error(`No se pudo descargar ${url}`);
}

// Recorte 4:3 (la proporcion del feed y del formulario) centrado en la zona de mas interes, sin agrandar
async function toCoverWebp(source: Buffer): Promise<Buffer> {
  const { width = 0, height = 0 } = await sharp(source).rotate().metadata();
  const cropWidth = Math.min(width, Math.floor((height * 4) / 3));
  const targetWidth = Math.min(MAX_WIDTH, cropWidth);
  return sharp(source)
    .rotate()
    .resize(targetWidth, Math.round((targetWidth * 3) / 4), { fit: 'cover', position: sharp.strategy.attention })
    .webp({ quality: 82 })
    .toBuffer();
}

async function main(): Promise<void> {
  const client = postgres(requireEnv('DATABASE_URL'), {
    ssl: requireEnv('DATABASE_SSL') === 'true' ? 'require' : false,
    max: 1,
  });
  const db = drizzle(client, { schema });
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${requireEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
  });
  const bucket = requireEnv('R2_BUCKET');
  const publicUrl = requireEnv('R2_PUBLIC_URL');

  try {
    for (const photo of recipePhotos) {
      const [recipe] = await db
        .select({ id: recipes.id, authorId: recipes.authorId })
        .from(recipes)
        .where(and(eq(recipes.title, photo.recipeTitle), isNull(recipes.coverImageUrl)))
        .limit(1);
      if (!recipe) {
        console.info(`Se omite "${photo.recipeTitle}": no existe o ya tiene foto`);
        continue;
      }

      const file = await fetchCommonsFile(photo.commonsFile);
      if (!FREE_LICENSE.test(file.license)) {
        console.warn(`Se omite "${photo.recipeTitle}": la licencia "${file.license}" no es libre`);
        continue;
      }

      const source = await downloadImage(file.original);
      const key = `recipes/${recipe.authorId}/${randomUUID()}.webp`;
      await s3.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: await toCoverWebp(source), ContentType: 'image/webp' }),
      );

      await db
        .update(recipes)
        .set({
          coverImageUrl: `${publicUrl}/${key}`,
          coverImageCredit: `${file.artist}, ${file.license}, Wikimedia Commons (recortada)`,
          coverImageCreditUrl: file.page,
          updatedAt: new Date(),
        })
        .where(eq(recipes.id, recipe.id));
      console.info(`Foto asignada a "${photo.recipeTitle}" (${file.license}, ${file.artist})`);
      // Pausa entre descargas para no saturar a Wikimedia
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } finally {
    await client.end();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
