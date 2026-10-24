# CLAUDE.md

Guía operativa para Claude Code en el repositorio `recet-system`. Las reglas normativas completas están en `AGENTS.md`; este archivo resume cómo trabajar el día a día y se refuerza conforme crece el proyecto.

## Qué es

Memoria del Comal (`memoriadelcomal.com`): red social gastronómica para el rescate de la cocina tradicional de Jutiapa (Guatemala), con búsqueda de recetas por ingredientes disponibles. Proyecto de graduación, Universidad Mariano Gálvez, Campus Jutiapa. La fuente de verdad de requerimientos es `Entrega 2 part2.md` (ignorado por git, no editar).

## Monorepo

Workspace pnpm con dos paquetes: `backend/` (NestJS 11 + Drizzle ORM + PostgreSQL) y `frontend/` (Next.js 15 App Router + React 19 + Tailwind).

## Reglas que no se negocian

- **pnpm exclusivo.** Nunca `npm` ni `yarn`. Instalar con `pnpm install`; agregar con `pnpm --filter backend add <paquete>`.
- **Cero `any`.** ESLint lo marca como error (`@typescript-eslint/no-explicit-any`). TypeScript en modo estricto.
- **Commits Conventional Commits** (`tipo(scope): resumen`), resumen y cuerpo en español, imperativo, sin emojis. Tipos: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, `style`. Los crea Claude al pedir subir cambios. PROHIBIDO agregar trailers `Co-Authored-By` o cualquier atribución al agente.
- **Sin emojis** en ningún archivo ni mensaje.
- **Sin variables de entorno quemadas** en el backend (ver sección Entorno).
- **Diseño monocromático con un acento.** Base monocromática (blanco, negro y escala zinc) con un solo acento, Brasa, y tres colores de estado. Los tokens están en `frontend/src/styles/globals.css` (`--brand`, `--success`, `--danger`, `--warning-soft`, con variante `-soft` y modo oscuro) y se exponen en `tailwind.config.ts`. Brasa (`#C2410C`, sacado del comal) va solo en la acción principal (`Button` `primary`: un botón relleno por pantalla), el anillo de foco y la reacción activa. Éxito (verde) en aprobar y estados positivos, peligro (rojo) en retirar, eliminar y errores, y el ámbar solo en el chip "En revisión". Los estados usan `StatusBadge` y `Notice` (`shared/components/ui`), siempre con ícono y texto, nunca solo color, y tinte suave en vez de fondo sólido. La navegación no lleva color (solo el tejido gris), ni tarjetas, encabezados o fondos; sin degradados ni sombras de color, y sin azul ni morado. Los botones de lista sin énfasis usan `variant="neutral"` (zinc oscuro). Además, el isotipo del comal (`BrandMark`, `public/brand/comal.png`, íconos de `public/icons/`) conserva sus colores por decisión del usuario. Los botones de navegación muestran el tejido gris (`NavTextile` en `shared/components/layout`) al pasar el cursor, al presionarlos y en la sección actual; el usuario descartó la versión a color. `rounded-md`/`rounded-lg` (máx. 8px); `rounded-full` solo en avatares. Nada de `uppercase`; texto en Sentence case o Title case. Títulos (`h1`, título de receta, marca) en serifa Lora con `font-serif`; recetas sin foto con `RecipeCoverPlaceholder`; elevación al pasar el mouse con sombra y borde, nunca con `transform` (rompe los modales `fixed` dentro de la tarjeta).

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
pnpm --filter backend db:seed         # carga el catálogo inicial (idempotente)
pnpm --filter backend db:seed-photos  # portadas con licencia libre de Wikimedia Commons (solo recetas sin foto)
pnpm --filter backend indicators -- --api=<url>   # indicadores de la Tabla 1 (solo lee la BD; busca por HTTP)
```

## Entorno (backend)

El backend no arranca sin un `.env` válido. El contrato está en `backend/src/config/env.validation.ts` (clase `EnvironmentVariables` + `validateEnvironment`), enganchado en `ConfigModule.forRoot({ validate })`. Rechaza variables ausentes, con formato inválido o con texto de plantilla (`REEMPLAZAR`, `dummy`, `change_me`, `<...>`).

- Leer siempre con `configService.getOrThrow('CLAVE')`. Nunca `.get(...)` ni `process.env` directo ni `|| 'valor'`.
- `drizzle.config.ts` valida aparte con `requireEnv()` porque corre fuera de Nest.
- Plantilla: `backend/.env.example`. Para preparar local, copiar a `backend/.env` y llenar valores reales.
- Al agregar una variable: sumarla a `EnvironmentVariables` con su validador, documentarla en `.env.example` y leerla con `getOrThrow`.

Variables actuales: `NODE_ENV`, `PORT`, `DATABASE_URL`, `DATABASE_SSL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`.

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
    moderation/                validación de recetas pendientes (solo ADMIN)
    media/                     URL prefirmada para subir fotos a Cloudflare R2
    contributor-requests/      solicitud del rol de colaborador (lado del usuario)
    exports/                   PDF de una receta y de "Mi recetario" (PDFKit + sharp)
    ingredients/               catálogo público y resolvedor de sinónimos, plurales y errores
    follows/                   seguir usuarios (tabla user_follows) y feed "Siguiendo"
```

Prefijo global de la API: `/api`. Auth por cookie `jwt` HTTP-only (o `Authorization: Bearer`). Roles: `USER`, `CONTRIBUTOR`, `ADMIN`. `POST /api/auth/dev-login` solo funciona con `NODE_ENV=development`.

Flujo de moderación (regla 4.3.4.a): `POST /api/recipes` exige rol `CONTRIBUTOR` o `ADMIN`; lo del colaborador nace en `PENDING_REVIEW` y no aparece en feed ni búsqueda hasta que el admin lo aprueba en `PATCH /api/moderation/recipes/:id` (`APPROVE` publica, `RETURN` regresa a `DRAFT` con `reviewNotes`). Solo el autor edita: el admin no edita contenido ajeno, lo retira con `DELETE /api/recipes/:id` (pestaña "Publicadas" de `/moderation` o botón en el detalle). El autor corrige y reenvía con `PATCH /api/recipes/:id` (vuelve a `PENDING_REVIEW` y limpia `reviewNotes`) y ve todas las suyas en `GET /api/recipes/mine`. El usuario pide el rol desde su perfil (`POST /api/contributor-requests`, aceptando las normas de contenido; una pendiente a la vez) y el admin la resuelve en `PATCH /api/moderation/contributor-requests/:id` (`APPROVE` otorga `CONTRIBUTOR`). El admin también otorga o retira `CONTRIBUTOR` directo con `PATCH /api/moderation/users/:id/role`; el rol se relee de BD en cada petición (`JwtStrategy.validate`), así que aplica sin reloguear. Rutas solo-admin: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('ADMIN')`. Fotos (R2): hasta 5 por receta (portada en `recipes.cover_image_url` y el resto en `recipe_images` vía `galleryImageUrls`); el usuario encuadra cada una a 4:3 en `PhotoCropModal` (`react-easy-crop`), el navegador recorta y comprime a WebP 1600px (`shared/lib/compressImage.ts`), pide `POST /api/media/recipe-images` y sube directo al bucket; `RecipesService.resolveImages` rechaza cualquier foto que no sea de `R2_PUBLIC_URL`. Portadas de bancos libres: `recipes.cover_image_credit` y `cover_image_credit_url` (migración 0007) guardan autor, licencia y enlace; `PhotoCredit` los muestra sobre la foto en el feed y el detalle, y el PDF los imprime (la licencia CC lo exige); cambiar la portada al editar borra el crédito. Las fotos del catálogo se asignan con `db:seed-photos` desde `seed/recipe-photos.ts` (revisadas a mano: solo fotos del mismo platillo; nunca copiar fotos de blogs). Perfil: cualquier sesión pide `POST /api/media/profile-images` (`kind` `avatar` o `cover`, ruta `users/<id>/`) y `PATCH /api/users/me` solo acepta fotos de su propia carpeta; `users.bio` y `users.cover_image_url` (migración 0005); `compressImage` vive en `shared/lib` y tras editar se llama `session.refresh()`. Feed social: la tarjeta reacciona, comenta (comentarios desplegables, slice `comments` con `InlineComments`) y comparte sin salir del feed; la reacción propia llega aparte por `GET /api/interactions/reactions/mine` (hook `useMyReactions`). Comunidad (alcance e): `POST /api/users/:id/follow` alterna el seguimiento, `GET /api/recipes/following` y `/author/:authorId` filtran `getFeed` por autores; el perfil público vive en `/user/[id]` (slice `user-profile`) y el feed muestra las pestañas "Todas" y "Siguiendo" solo con sesión. Búsqueda (RR-03 y regla b): todo término pasa por `IngredientCatalogService.resolve` (sinónimos en `ingredients/ingredient-synonyms.ts`, cuyo destino debe existir tal cual en `ingredients.name`); lo que no está en el catálogo no se busca. Feed y búsqueda nunca consultan receta por receta: `getStatsFor` y `getBreakdownsFor` traen reacciones, comentarios y desglose de todos los resultados en consultas agrupadas (así lo describe la tesis en la secuencia de búsqueda); `toFeedItem` arma cada resultado. En el frontend, los botones rápidos salen de `GET /api/ingredients`, nunca de una lista quemada. Exportación (solo PDF, decisión de la asesora): `GET /api/exports/recipes/:id/pdf` reutiliza `RecipesService.getDetail` para heredar la visibilidad y `GET /api/exports/cookbook/pdf` arma el recetario guardado; en el frontend son enlaces directos (slice `recipe-export`), no `apiClient`. Rutas públicas que se enriquecen con la sesión (p. ej. `GET /recipes/:id`): `@UseGuards(OptionalJwtAuthGuard)`, que deja pasar al invitado con `user` nulo.

## Estructura del frontend

Vertical Slice Architecture. Cada slice en `src/features/<slice>/` con `api/`, `components/`, `hooks/`, `types.ts` e `index.ts` (barril público). Las páginas de `src/app/**/page.tsx` solo renderizan el `Screen` de su slice. Lo transversal (UI base, `apiClient`, tipos de dominio) vive en `src/shared/`. El cliente HTTP lee `NEXT_PUBLIC_API_URL` y lanza `ApiError` con el `status` HTTP para distinguir 401/403. El slice `moderation` (`/moderation`) es el panel del admin y no usa datos semilla. PWA (PP-12): `app/manifest.ts` + `public/sw.js` (sin dependencias; solo cachea lecturas públicas y las fotos de R2, hasta 60, nunca sesión; subir `CACHE_VERSION` al cambiarlo; si cambia el dominio de `R2_PUBLIC_URL`, actualizar `PHOTO_HOSTS`) registrado por `@/shared/pwa` solo en producción. La sesión vive en `@/shared/session` (`SessionProvider` en el layout + `useSession()`); para mostrar u ocultar algo según el rol usar `hasRole(...)`, nunca datos quemados.

## Base de datos

PostgreSQL 16+ con SSL forzado en entornos gestionados (`DATABASE_SSL=true`). Tablas: `users`, `recipes`, `ingredients` + `recipe_ingredients` (N:M para la búsqueda), `recipe_reactions`, `recipe_bookmarks`, `recipe_comments`, `contributor_requests`, `user_follows`, `recipe_images`. `recipes.source_type` distingue `REFERENCE` (documental), `INTERVIEW` (campo) y `COMMUNITY` (colaborador); nunca marcar como `INTERVIEW` algo que no salió de una entrevista real. El seed (`backend/src/database/seed/`) corre fuera de Nest con `requireEnv()` y publica con cuentas de demostración ficticias `@demo.invalid`. Migraciones con `drizzle-kit`; los SQL y `backend/drizzle/meta/` (snapshots y `_journal.json`, que `db:migrate` necesita) se versionan. `backend/.env` local apunta a la base de producción en Railway: `db:migrate` desde local aplica en producción.

## Flujo de trabajo esperado

1. Implementar el cambio respetando las reglas anteriores.
2. `pnpm --filter <paquete> typecheck` y `pnpm lint` en verde.
3. Reflejar en `README.md` y en este archivo cualquier módulo, endpoint o decisión de arquitectura nueva, en la misma edición.
4. Al pedir subir cambios: commit con prefijo Conventional Commits (`tipo(scope): ...`), resumen y cuerpo en español, sin emojis, sin trailers de co-autoría ni atribución al agente. Un commit por unidad lógica; no mezclar frontend con backend.
