# CLAUDE.md

Guía operativa para Claude Code en el repositorio `recet-system`. Las reglas normativas completas están en `AGENTS.md`; este archivo resume cómo trabajar el día a día y se refuerza conforme crece el proyecto.

## Qué es

Red social gastronómica para el rescate de la cocina tradicional de Jutiapa (Guatemala), con búsqueda de recetas por ingredientes disponibles. Proyecto de graduación, Universidad Mariano Gálvez, Campus Jutiapa. La fuente de verdad de requerimientos es `Entrega I part2.md` (ignorado por git, no editar).

## Monorepo

Workspace pnpm con dos paquetes: `backend/` (NestJS 11 + Drizzle ORM + PostgreSQL) y `frontend/` (Next.js 15 App Router + React 19 + Tailwind).

## Reglas que no se negocian

- **pnpm exclusivo.** Nunca `npm` ni `yarn`. Instalar con `pnpm install`; agregar con `pnpm --filter backend add <paquete>`.
- **Cero `any`.** ESLint lo marca como error (`@typescript-eslint/no-explicit-any`). TypeScript en modo estricto.
- **Commits Conventional Commits** (`tipo(scope): resumen`), resumen y cuerpo en español, imperativo, sin emojis. Tipos: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, `style`. Los crea Claude al pedir subir cambios. PROHIBIDO agregar trailers `Co-Authored-By` o cualquier atribución al agente.
- **Sin emojis** en ningún archivo ni mensaje.
- **Sin variables de entorno quemadas** en el backend (ver sección Entorno).
- **Diseño monocromático.** Blanco, negro y escala zinc. Sin acentos de color. `rounded-md`/`rounded-lg` (máx. 8px); `rounded-full` solo en avatares. Nada de `uppercase`; texto en Sentence case o Title case.

## Comandos

```bash
pnpm install                          # instala todo el workspace

pnpm --filter backend start:dev       # API NestJS en watch (puerto de PORT)
pnpm --filter frontend dev            # Next.js dev

pnpm --filter backend typecheck       # tsc --noEmit
pnpm --filter frontend typecheck
pnpm lint                             # ESLint en toda la raíz

pnpm --filter backend db:generate     # genera SQL de migración desde el schema
pnpm --filter backend db:migrate      # aplica migraciones
pnpm --filter backend db:studio       # inspector de Drizzle
```

## Entorno (backend)

El backend no arranca sin un `.env` válido. El contrato está en `backend/src/config/env.validation.ts` (clase `EnvironmentVariables` + `validateEnvironment`), enganchado en `ConfigModule.forRoot({ validate })`. Rechaza variables ausentes, con formato inválido o con texto de plantilla (`REEMPLAZAR`, `dummy`, `change_me`, `<...>`).

- Leer siempre con `configService.getOrThrow('CLAVE')`. Nunca `.get(...)` ni `process.env` directo ni `|| 'valor'`.
- `drizzle.config.ts` valida aparte con `requireEnv()` porque corre fuera de Nest.
- Plantilla: `backend/.env.example`. Para preparar local, copiar a `backend/.env` y llenar valores reales.
- Al agregar una variable: sumarla a `EnvironmentVariables` con su validador, documentarla en `.env.example` y leerla con `getOrThrow`.

Variables actuales: `NODE_ENV`, `PORT`, `DATABASE_URL`, `DATABASE_SSL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.

## Estructura del backend

```
backend/src/
  config/env.validation.ts     contrato estricto de entorno
  common/                      decoradores, filtros, guards (JWT, roles)
  database/                    DatabaseService (pool postgres-js) y schema Drizzle
    schema/schema.ts           esquema relacional con índices
  modules/
    auth/                      Google OAuth 2.0 + JWT en cookie HTTP-only
    users/                     perfil y roles
    recipes/                   CRUD de recetas y búsqueda por ingredientes
    interactions/              reacciones y comentarios (1 nivel de hilo)
```

Prefijo global de la API: `/api`. Auth por cookie `jwt` HTTP-only (o `Authorization: Bearer`). Roles: `USER`, `CONTRIBUTOR`, `ADMIN`. `POST /api/auth/dev-login` solo funciona con `NODE_ENV=development`.

## Estructura del frontend

Vertical Slice Architecture. Cada slice en `src/features/<slice>/` con `api/`, `components/`, `hooks/`, `types.ts` e `index.ts` (barril público). Las páginas de `src/app/**/page.tsx` solo renderizan el `Screen` de su slice. Lo transversal (UI base, `apiClient`, tipos de dominio) vive en `src/shared/`. El cliente HTTP lee `NEXT_PUBLIC_API_URL`.

## Base de datos

PostgreSQL 16+ con SSL forzado en entornos gestionados (`DATABASE_SSL=true`). Tablas: `users`, `recipes`, `ingredients` + `recipe_ingredients` (N:M para la búsqueda), `recipe_reactions`, `recipe_bookmarks`, `recipe_comments`. Migraciones con `drizzle-kit`; los metadatos en `backend/drizzle/meta/` están en `.gitignore`.

## Flujo de trabajo esperado

1. Implementar el cambio respetando las reglas anteriores.
2. `pnpm --filter <paquete> typecheck` y `pnpm lint` en verde.
3. Reflejar en `README.md` y en este archivo cualquier módulo, endpoint o decisión de arquitectura nueva, en la misma edición.
4. Al pedir subir cambios: commit con prefijo Conventional Commits (`tipo(scope): ...`), resumen y cuerpo en español, sin emojis, sin trailers de co-autoría ni atribución al agente. Un commit por unidad lógica; no mezclar frontend con backend.
