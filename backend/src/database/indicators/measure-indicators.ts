import { config as loadEnvFile } from 'dotenv';
import { performance } from 'node:perf_hooks';
import postgres from 'postgres';
import { INGREDIENT_SYNONYMS } from '../../modules/ingredients/ingredient-synonyms';

// Indicadores tecnicos de la Tabla 1 (capitulo de pruebas). Solo lee la base; las busquedas van por HTTP.
// Uso: pnpm --filter backend indicators -- --api=https://api.memoriadelcomal.com/api [--reps=5]
loadEnvFile({ path: '.env.local' });
loadEnvFile({ path: '.env' });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Falta la variable de entorno obligatoria ${name}. Complete backend/.env.`);
  }
  return value;
}

function readArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

interface SearchHit {
  id: string;
  matchPercentage?: number;
}

interface SearchCase {
  label: string;
  terms: string[];
  // Recetas que una busqueda correcta debe devolver
  expectedIds: string[];
}

interface CaseResult extends SearchCase {
  timesMs: number[];
  returnedIds: string[];
  relevant: boolean;
}

const WARMUP_REQUESTS = 3;
const RESULT_LIMIT = 50;

function percentile(sorted: number[], p: number): number {
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, index)];
}

const round = (n: number): string => n.toFixed(1);

// Un error 5xx aislado (p. ej. conexion a la BD cortada) se reintenta una vez y se reporta aparte
let retriedRequests = 0;

async function timedSearch(api: string, terms: string[], retry = true): Promise<{ ms: number; hits: SearchHit[] }> {
  const url = `${api}/recipes/search?limit=${RESULT_LIMIT}&ingredients=${encodeURIComponent(terms.join(','))}`;
  const start = performance.now();
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  const body = (await res.json()) as SearchHit[];
  const ms = performance.now() - start;
  if (res.status >= 500 && retry) {
    retriedRequests++;
    return timedSearch(api, terms, false);
  }
  if (!res.ok) throw new Error(`La busqueda respondio ${res.status} para "${terms.join(', ')}"`);
  return { ms, hits: body };
}

async function main(): Promise<void> {
  const api = readArg('api');
  if (!api) throw new Error('Indique la API a medir con --api=<url terminada en /api>');
  const reps = Number(readArg('reps') ?? '5');

  const sql = postgres(requireEnv('DATABASE_URL'), {
    ssl: requireEnv('DATABASE_SSL') === 'true' ? 'require' : false,
    max: 1,
  });

  try {
    // --- Conteos (numero de recetas catalogadas) ---
    const byStatus = await sql<{ status: string; n: number }[]>`
      select status, count(*)::int as n from recipes group by status order by status`;
    const bySource = await sql<{ source_type: string; n: number }[]>`
      select source_type, count(*)::int as n from recipes where status = 'PUBLISHED' group by source_type order by source_type`;

    // --- Cobertura: ingredientes catalogados que sirven como criterio de busqueda ---
    const [coverage] = await sql<{ total: number; used: number }[]>`
      select count(*)::int as total,
             count(*) filter (where exists (
               select 1 from recipe_ingredients ri join recipes r on r.id = ri.recipe_id
               where ri.ingredient_id = i.id and r.status = 'PUBLISHED'))::int as used
      from ingredients i`;
    const catalogNames = new Set(
      (await sql<{ name: string }[]>`select name from ingredients`).map((r) => r.name),
    );
    const synonymEntries = Object.entries(INGREDIENT_SYNONYMS);
    const validSynonyms = synonymEntries.filter(([, target]) => catalogNames.has(target));

    // --- Casos de busqueda armados desde las recetas publicadas ---
    const recipeRows = await sql<{ id: string; title: string; names: string[] }[]>`
      select r.id, r.title, array_agg(i.name order by i.name) as names
      from recipes r
      join recipe_ingredients ri on ri.recipe_id = r.id
      join ingredients i on i.id = ri.ingredient_id
      where r.status = 'PUBLISHED'
      group by r.id, r.title
      order by r.title`;

    const recipesByIngredient = new Map<string, string[]>();
    for (const r of recipeRows) {
      for (const name of r.names) {
        recipesByIngredient.set(name, [...(recipesByIngredient.get(name) ?? []), r.id]);
      }
    }

    const cases: SearchCase[] = [];
    // 1) Por receta: tres de sus ingredientes deben devolverla
    for (const r of recipeRows) {
      cases.push({ label: `Receta: ${r.title}`, terms: r.names.slice(0, 3), expectedIds: [r.id] });
    }
    // 2) Por sinonimo regional: el alias debe devolver las recetas del nombre oficial
    for (const [alias, target] of validSynonyms) {
      const expected = recipesByIngredient.get(target);
      if (expected) cases.push({ label: `Sinonimo: ${alias} -> ${target}`, terms: [alias], expectedIds: expected });
    }

    // --- Medicion ---
    for (let i = 0; i < WARMUP_REQUESTS; i++) await timedSearch(api, ['maíz']);

    const results: CaseResult[] = [];
    for (const c of cases) {
      const timesMs: number[] = [];
      let returnedIds: string[] = [];
      for (let i = 0; i < reps; i++) {
        const { ms, hits } = await timedSearch(api, c.terms);
        timesMs.push(ms);
        returnedIds = hits.filter((h) => (h.matchPercentage ?? 0) > 0).map((h) => h.id);
      }
      const relevant = c.expectedIds.every((id) => returnedIds.includes(id));
      results.push({ ...c, timesMs, returnedIds, relevant });
    }

    // --- Reporte en Markdown ---
    const all = results.flatMap((r) => r.timesMs).sort((a, b) => a - b);
    const mean = all.reduce((s, n) => s + n, 0) / all.length;
    const relevantCount = results.filter((r) => r.relevant).length;
    const now = new Date().toISOString();

    const lines: string[] = [];
    lines.push(`# Indicadores tecnicos medidos el ${now}`);
    lines.push('');
    lines.push(`API medida: ${api}. Repeticiones por busqueda: ${reps}. Calentamiento descartado: ${WARMUP_REQUESTS} solicitudes.`);
    lines.push('');
    lines.push('## Numero de recetas catalogadas');
    lines.push('');
    lines.push('| Estado | Recetas |', '|---|---|');
    for (const row of byStatus) lines.push(`| ${row.status} | ${row.n} |`);
    lines.push('');
    lines.push('| Origen (publicadas) | Recetas |', '|---|---|');
    for (const row of bySource) lines.push(`| ${row.source_type} | ${row.n} |`);
    lines.push('');
    lines.push('## Cobertura del filtrado por ingredientes');
    lines.push('');
    lines.push('| Medida | Valor |', '|---|---|');
    lines.push(`| Ingredientes catalogados | ${coverage.total} |`);
    lines.push(`| Usados en al menos una receta publicada (buscables) | ${coverage.used} |`);
    lines.push(`| Cobertura | ${round((coverage.used / coverage.total) * 100)} % |`);
    lines.push(`| Sinonimos regionales con destino valido | ${validSynonyms.length} de ${synonymEntries.length} |`);
    lines.push('');
    lines.push('## Tiempo de respuesta del motor de busqueda');
    lines.push('');
    lines.push('| Medida | Milisegundos |', '|---|---|');
    lines.push(`| Solicitudes medidas | ${all.length} |`);
    lines.push(`| Reintentadas por error 5xx | ${retriedRequests} |`);
    lines.push(`| Minimo | ${round(all[0])} |`);
    lines.push(`| Promedio | ${round(mean)} |`);
    lines.push(`| Mediana (p50) | ${round(percentile(all, 50))} |`);
    lines.push(`| Percentil 95 | ${round(percentile(all, 95))} |`);
    lines.push(`| Maximo | ${round(all[all.length - 1])} |`);
    lines.push('');
    lines.push('## Eficiencia del motor de busqueda');
    lines.push('');
    lines.push(`Busquedas de prueba: ${results.length}. Con resultados relevantes: ${relevantCount}. Eficiencia: ${round((relevantCount / results.length) * 100)} %.`);
    lines.push('');
    lines.push('| Caso | Terminos | Relevante | Promedio ms |', '|---|---|---|---|');
    for (const r of results) {
      const avg = r.timesMs.reduce((s, n) => s + n, 0) / r.timesMs.length;
      lines.push(`| ${r.label} | ${r.terms.join(', ')} | ${r.relevant ? 'Si' : 'No'} | ${round(avg)} |`);
    }
    console.info(lines.join('\n'));
  } finally {
    await sql.end();
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
