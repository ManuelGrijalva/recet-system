# Memoria del Comal: red social gastronómica tradicional de Jutiapa (MVP)

**Memoria del Comal** (`memoriadelcomal.com`) es una plataforma comunitaria para la difusión y el rescate de la gastronomía tradicional del departamento de Jutiapa, Guatemala, con un motor de búsqueda inteligente por ingredientes disponibles. Proyecto de graduación para la Universidad Mariano Gálvez de Guatemala, Campus Jutiapa.

Este README es documentación viva: se actualiza en la misma edición que introduce cada módulo, endpoint o decisión de arquitectura nueva.

## Índice

- [Puesta en marcha](#puesta-en-marcha)
- [Comandos](#comandos)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Arquitectura del frontend](#arquitectura-del-frontend)
- [Arquitectura del backend](#arquitectura-del-backend)
- [Modelo de datos](#modelo-de-datos)
- [Convenciones del proyecto](#convenciones-del-proyecto)

## Puesta en marcha

Requisitos: Node.js 20+, pnpm 10+ o 12+, y una base PostgreSQL 16+ accesible (local o gestionada).

El repositorio es un workspace pnpm con dos paquetes: `backend` (API NestJS) y `frontend` (web Next.js). Se levantan en dos terminales.

### 1. Dependencias

```bash
pnpm install            # instala backend y frontend desde la raiz
```

### 2. Variables de entorno

Backend (`backend/.env`, obligatorio, validado al arrancar):

```bash
cp backend/.env.example backend/.env
```

Completar como minimo `DATABASE_URL`, `DATABASE_SSL` y las credenciales de Google
(`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) y de Cloudflare R2 (`R2_*`, ver "Fotos de recetas"). El backend no inicia si falta una
variable, tiene formato invalido o conserva texto de plantilla.

Frontend (`frontend/.env.local`, ignorado por git):

```bash
cp frontend/.env.example frontend/.env.local
```

| Variable | Valor local | Uso |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Base del API que consume el cliente (`shared/lib/apiClient.ts`) y el inicio de sesion con Google. Debe incluir el prefijo `/api`. |

Si se omite `frontend/.env.local`, el frontend cae al valor por defecto
`http://localhost:4000/api`, por lo que arranca contra un backend local sin
configuracion extra.

### 3. Base de datos

```bash
pnpm --filter backend db:migrate       # aplica las migraciones versionadas en backend/drizzle
```

Alternativa para prototipar sin generar migracion: `pnpm --filter backend db:push`.

### Catálogo inicial (PP-03)

`pnpm --filter backend db:seed` carga 21 recetas tradicionales desde `backend/src/database/seed/seed-data.ts`: 9 de Jutiapa y el oriente (tamal de viaje, gallo en chicha, quesadilla jutiapaneca, melcochas y alboroto de Atescatempa, caldo de res, carne guisada, buñuelos) y 12 del recetario nacional. Son **recetas de referencia documental** (`source_type = REFERENCE`) con su fuente citada: Sistema de Información Cultural del Ministerio de Cultura y Deportes, Centro de Estudios Folklóricos de la USAC y Living in Guatemala, entre otras. Los textos están redactados a partir de esas fuentes.

Las recetas aparecen publicadas por **seis cuentas de demostración ficticias** con correo `@demo.invalid` y rol `CONTRIBUTOR`. No son informantes reales ni entrevistas de campo. El script es idempotente: vuelve a crear las recetas del mismo título de esos autores sin duplicarlas.

Fotos del catálogo: `pnpm --filter backend db:seed-photos` asigna portadas con licencia libre de Wikimedia Commons a las recetas sin foto, según la lista revisada a mano en `backend/src/database/seed/recipe-photos.ts` (solo fotos del mismo platillo; las marcadas `equivalente` son de otro país, de un platillo que se prepara igual). Comprueba la licencia en Commons al momento de asignar, recorta a 4:3 y sube a R2, y guarda el crédito (autor, licencia y enlace) en `recipes.cover_image_credit` y `cover_image_credit_url`, que se muestran sobre la foto y en el PDF. Es idempotente: no toca recetas que ya tienen foto. Las recetas sin foto libre conservan el patrón de tejido.

### 4. Levantar ambos proyectos

```bash
# Terminal 1 - API en http://localhost:4000/api
pnpm --filter backend start:dev

# Terminal 2 - Web en http://localhost:3000
pnpm --filter frontend dev
```

Atajos equivalentes desde la raiz: `pnpm dev:backend` y `pnpm dev:frontend`.

### 5. Pruebas rapidas en local

- API viva: `curl http://localhost:4000/api/recipes/feed`.
- Web: abrir `http://localhost:3000`; el feed y el detalle funcionan con datos
  semilla aunque el backend no responda (`withFallback`).
- Sesion de desarrollo sin Google: con el backend en `NODE_ENV=development`,
  `POST http://localhost:4000/api/auth/dev-login` con cuerpo JSON `{ "email": "...", "name": "..." }`.

## Comandos

| Acción | Comando |
|---|---|
| Instalar dependencias del workspace | `pnpm install` |
| Frontend en desarrollo | `pnpm --filter frontend dev` |
| Backend NestJS en watch | `pnpm --filter backend start:dev` |
| Chequeo de tipos | `pnpm --filter frontend typecheck` / `pnpm --filter backend typecheck` |
| Linteo estricto (cero `any`) | `pnpm lint` |
| Generar migración Drizzle desde el schema | `pnpm --filter backend db:generate` |
| Aplicar migraciones versionadas | `pnpm --filter backend db:migrate` |
| Empujar el schema sin migración (prototipo) | `pnpm --filter backend db:push` |
| Inspector de base de datos | `pnpm --filter backend db:studio` |
| Cargar el catálogo inicial de recetas (idempotente) | `pnpm --filter backend db:seed` |
| Asignar portadas con licencia libre a recetas sin foto (idempotente) | `pnpm --filter backend db:seed-photos` |
| Medir los indicadores técnicos de la Tabla 1 (conteo, cobertura, tiempo de respuesta y eficiencia de la búsqueda) | `pnpm --filter backend indicators -- --api=https://api.memoriadelcomal.com/api [--reps=5]` |

## Stack tecnológico

| Capa | Tecnología | Detalle |
|---|---|---|
| Frontend | Next.js 15 (App Router) | React 19, Vertical Slice Architecture |
| Estilos | Tailwind CSS 3 | Base crema y arena con tapiz de figuras de Guatemala, acento Brasa y colores de estado |
| Backend | NestJS 11 | Modular, TypeScript estricto |
| Base de datos | PostgreSQL 16+ | Alojada en Railway, SSL controlado por `DATABASE_SSL` |
| ORM | Drizzle ORM | Con `drizzle-kit`. Prohibido TypeORM |
| Calidad | TypeScript + ESLint | Modo estricto, `@typescript-eslint/no-explicit-any: ["error"]` |
| Gestor de paquetes | pnpm | Exclusivo. Prohibido `npm` y `yarn` |

## Estructura del repositorio

```text
recet-system/
├── .agents/rules/          Reglas para agentes (gestor de paquetes, etc.)
├── backend/                API NestJS + Drizzle ORM
│   ├── .env.example        Plantilla de entorno (copiar a backend/.env)
│   ├── drizzle/            Migraciones SQL versionadas
│   └── src/
│       ├── common/         Decoradores, filtros y guards
│       ├── config/         Validación de variables de entorno al arranque
│       ├── database/       Conexión SSL y esquema Drizzle
│       └── modules/        auth, users, recipes, interactions, moderation, media, contributor-requests, exports, ingredients, follows
├── frontend/               Web Next.js (App Router)
│   ├── .env.example        Plantilla de entorno (copiar a frontend/.env.local)
│   └── src/
│       ├── app/            Rutas: solo renderizan el Screen de cada slice
│       ├── features/       Vertical slices (recipe-feed, reactions, ...)
│       └── shared/         UI base, apiClient, tipos de dominio compartidos
├── AGENTS.md               Directrices del proyecto (fuente de verdad)
├── CLAUDE.md               Guía operativa para Claude Code
└── pnpm-workspace.yaml
```

`Entrega I part2.md` es el documento rector de requerimientos. Está ignorado en `.gitignore` y no se versiona.

## Arquitectura del frontend

Vertical Slice Architecture: cada funcionalidad se aísla en `frontend/src/features/<slice>/`.

```
features/<slice>/
  api/          Llamadas al backend (apiClient) + seed .mock.ts + fallback
  components/   <Slice>Screen.tsx (contenedor) + presentacionales pequeños
  hooks/        use<Slice>* con estado y orquestación
  lib/          Lógica pura y testeable (reducers, algoritmos)
  types.ts      Tipos del slice (extienden los de @/shared/types)
  index.ts      Barril con la API pública del slice
```

- `app/**/page.tsx` no contiene lógica ni JSX de negocio: importa y renderiza el `Screen` del slice.
- La capa `api/` llama al backend real y cae a datos semilla con `withFallback`, de modo que la interfaz funciona sin backend levantado.
- Imports mediante el alias `@/` (`@/features/...`, `@/shared/...`).

Slices: `recipe-feed`, `recipe-detail`, `recipe-compose` (también edita en `/recipe/[id]/edit`), `ingredient-search`, `saved-recipes`, `profile` (perfil propio estilo red social: portada, avatar, presentación, modal "Editar perfil" y pestañas Mis recetas, Guardadas e Información), `auth`, `comments`, `reactions`, `moderation`, `contributor-request`, `user-profile` (perfil público en `/user/[id]` con seguir y sus recetas; se llega tocando el autor; su `ProfileHeader` con portada, o el patrón de tejido `TextilePattern` si no hay, lo reutiliza `profile`), `recipe-share` (compartir con el menú nativo del celular o copiando el enlace), `recipe-export` (botones "Descargar PDF" en el detalle y "Descargar mi recetario en PDF" en guardados; son enlaces directos al backend), `my-recipes` (sección "Mis recetas" del perfil para colaboradores y admin: estado, observaciones, editar y eliminar), `offline`. Todas las páginas de `app/` están adelgazadas a un solo `Screen`.

### Páginas legales

`/privacidad` y `/terminos` (slice `legal`, contenido en `features/legal/lib/legalContent.ts`). Google las exige para publicar la pantalla de consentimiento OAuth; están enlazadas desde el login y la barra lateral.

### Consulta sin conexión (PWA, PP-12)

La web es una aplicación web progresiva: se puede agregar a la pantalla de inicio del teléfono y abrir sin internet las recetas ya visitadas.

- `src/app/manifest.ts`: manifiesto (nombre, íconos de `public/icons/`, `display: standalone`).
- `public/sw.js`: service worker sin dependencias. Archivos estáticos con *cache-first*; páginas y lecturas públicas de la API (`/api/recipes...` y comentarios) con *network-first*, cayendo a la caché sin conexión. Nunca guarda datos de sesión. Sin caché, las páginas muestran `/offline` y la API responde 503 "Sin conexión". Las fotos de recetas (`img.memoriadelcomal.com`, que responde con CORS para el sitio) se piden en modo `cors` y se guardan con *cache-first* en `photos-<versión>`, hasta 60 (se borran las más antiguas), para que las recetas visitadas se vean completas sin conexión.
- `src/shared/pwa/ServiceWorkerRegistrar.tsx`: registra el service worker **solo en producción**, para que en desarrollo no se sirvan versiones viejas.
- Para probarlo en local: `pnpm --filter frontend build` y `pnpm --filter frontend start`; en Chrome, DevTools > Application > Service workers, y marcar "Offline" en la pestaña Network. En un teléfono requiere HTTPS (el despliegue), salvo en `localhost`.
- Al cambiar la estrategia de caché, subir `CACHE_VERSION` en `sw.js`.

### Layout responsivo

- Móvil: barra de navegación inferior fija, feed a una columna, modales tipo bottom sheet.
- Escritorio: barra lateral izquierda fija (`w-64`), feed central `max-w-2xl`, barra lateral derecha (`lg:` en adelante) con sugerencias y tendencias.
- Validación (`/moderation`): el slice `moderation` tiene cuatro pestañas: recetas pendientes (aprobar o devolver con observaciones), publicadas (buscar y eliminar las que no cumplan las normas), solicitudes (aprobar o rechazar a quien pide ser colaborador) y usuarios (otorgar o retirar el rol de colaborador). El admin también ve "Eliminar receta" en el detalle de recetas ajenas; no las edita.
- Solicitud de colaborador: el slice `contributor-request` se muestra en el perfil de los usuarios con rol `USER`. Explica qué permite el rol, las normas de contenido y la advertencia de eliminación; exige aceptar las normas y admite un texto opcional sobre las recetas que quiere compartir. Muestra el estado (en revisión, aprobada o rechazada con motivo) y permite volver a solicitar tras un rechazo. Es la única lectura sin datos semilla: si el backend responde 401/403 se muestra el aviso en lugar de recetas ficticias. Los errores HTTP llegan como `ApiError` (con `status`) desde `@/shared/lib/apiClient`.
- Sesión: `@/shared/session` expone `SessionProvider` (montado en `app/layout.tsx`, consulta `GET /auth/me` una vez) y `useSession()` con `user`, `status` (`loading`/`authenticated`/`guest`), `hasRole()` y `logout()`. Las barras de navegación filtran sus enlaces con `isNavVisible` según el rol: publicar solo para `CONTRIBUTOR`/`ADMIN`, validar solo para `ADMIN`, guardados y perfil con sesión, y "Iniciar sesión" para invitados.
- Acceso (`/login`): el slice `auth` monta `LoginScreen` como overlay `fixed inset-0` para salir del layout con barras. Escritorio: foto (`shared/assets/login-guate.jpg`) a media pantalla más el formulario; móvil: franja superior delgada con un fragmento de la misma foto. Único acceso: `GoogleLoginButton` con el logotipo de `shared/assets/google.svg`.

## Arquitectura del backend

Módulos en `backend/src/modules/`, cada uno con `*.controller.ts`, `*.service.ts` y `dto/`:

- `auth`: Google OAuth 2.0, emisión de JWT en cookie HTTP-Only, `dev-login` para desarrollo.
- `users`: perfil privado (`/users/me`) y público (`GET /users/:id`, con `bio`, `coverImageUrl`, `publishedRecipesCount`, `followersCount`, `followingCount` e `isFollowing` para quien consulta con sesión); el teléfono es privado y editable. `PATCH /users/me` acepta `name`, `bio` (máx. 300; cadena vacía la borra), `phone`, `avatarUrl` y `coverImageUrl`; las dos fotos deben empezar por `R2_PUBLIC_URL/users/<id propio>/` y `null` vuelve a la foto de Google o quita la portada.
- `follows` (alcance e): `POST /users/:id/follow` (sesión) sigue o deja de seguir y devuelve `{ isFollowing, followersCount }`; nadie puede seguirse a sí mismo. `GET /recipes/following` (sesión) es el feed de los autores que sigue y `GET /recipes/author/:authorId` lista las publicadas de un autor; ambos reutilizan `getFeed` con filtro de autores.
- `recipes`: alta de recetas (solo `CONTRIBUTOR` y `ADMIN`; las del colaborador nacen en `PENDING_REVIEW`, las del admin se publican directo), edición solo por su autor (`PATCH /recipes/:id`; el admin modera aprobando, devolviendo o eliminando, no edita contenido ajeno; lo editado por un colaborador vuelve a `PENDING_REVIEW` y se limpian las observaciones), listado propio en todos los estados (`GET /recipes/mine`), feed paginado (`/recipes/feed`), búsqueda (`/recipes/search`, con porcentaje y desglose de ingredientes coincidentes/faltantes; una consulta agrupada calcula las coincidencias de todas las recetas, y reacciones, comentarios y desglose se cargan para todos los resultados a la vez, no receta por receta, igual que en el feed), detalle (`GET /recipes/:id` devuelve también `ingredients`, `steps`, la `userReaction` y si la tiene guardada (`isBookmarked`) quien consulta; las recetas no publicadas responden 404 salvo para su autor y el admin) y borrado.
- `interactions`: reacciones (`LIKE`, `YUMMY`, `TRIED_IT`), guardados (`GET /interactions/bookmarks` incluye el autor de cada receta) y comentarios con un nivel de hilo. `GET /interactions/reactions/mine?recipeIds=a,b` (sesión, hasta 50) devuelve la reacción propia de cada receta visible para resaltarla en el feed; vive fuera de `/recipes` para que el service worker no la guarde. `DELETE /interactions/comments/:id` (autor o admin) borra también las respuestas del comentario.
- `ingredients` (público): `GET /ingredients` devuelve el catálogo usado por recetas publicadas con su `recipeCount` (los más usados primero) y `GET /ingredients/resolve?terms=a,b` explica cómo se interpreta cada término: `exact`, `synonym` (diccionario de sinónimos regionales en `ingredient-synonyms.ts`, riesgo RR-03), `family` ("queso" abarca "queso seco" y "queso fresco"), `typo` (errores de escritura según el largo de la palabra, solo si hay un único candidato) o `none` (no está en el catálogo, regla de negocio b). Ignora acentos, mayúsculas y plurales. `GET /recipes/search` usa el mismo resolvedor antes de calcular el porcentaje.
- `exports` (solo PDF): `GET /exports/recipes/:id/pdf` descarga la ficha de una receta (foto, tiempos, ingredientes, pasos, fuente citada y enlace a la página) con las mismas reglas de visibilidad que `GET /recipes/:id`, así que el invitado descarga las publicadas y el autor o el admin también las no publicadas. `GET /exports/cookbook/pdf` (sesión) descarga "Mi recetario": portada con índice y una página por receta guardada y publicada (máx. 50); responde 404 si no hay ninguna. Se generan con PDFKit; las fotos WebP de R2 se convierten a JPEG recortado 16:9 con `sharp` y, si no se pueden leer, el PDF sale sin foto.
- `contributor-requests` (sesión): `GET /contributor-requests/mine` devuelve `{ request }` con la solicitud más reciente o `null`; `POST /contributor-requests` con `{ "acceptedGuidelines": true, "motivation"?: "..." }` la crea (solo rol `USER`, una pendiente a la vez).
- `moderation` (solo `ADMIN`): `GET /moderation/recipes/pending` lista las recetas en revisión (más antiguas primero), `GET /moderation/recipes/published?q=` lista las publicadas más recientes (máx. 50, filtro por título) para eliminarlas con `DELETE /recipes/:id`, y `PATCH /moderation/recipes/:id` con `{ "decision": "APPROVE" }` las publica o con `{ "decision": "RETURN", "notes": "..." }` las devuelve a `DRAFT` con observaciones en `reviewNotes`. `GET /moderation/users?q=` busca usuarios por nombre o correo y `PATCH /moderation/users/:id/role` con `{ "role": "CONTRIBUTOR" | "USER" }` otorga o retira el rol de colaborador (no modifica cuentas `ADMIN`). `GET /moderation/contributor-requests` lista las solicitudes pendientes con su usuario y `PATCH /moderation/contributor-requests/:id` con `{ "decision": "APPROVE" }` otorga el rol `CONTRIBUTOR` en la misma transacción, o con `{ "decision": "REJECT", "notes"?: "..." }` la rechaza con un motivo visible para el usuario.

- `media` (`CONTRIBUTOR` y `ADMIN`): `POST /media/recipe-images` con `{ "contentType": "image/webp" | "image/jpeg", "size": <bytes> }` (máx. 3 MB) devuelve `uploadUrl` (URL prefirmada de R2, válida 5 minutos, que firma tipo y tamaño) y `publicUrl`. `recipes` solo acepta un `coverImageUrl` que empiece por `R2_PUBLIC_URL/recipes/`; `null` quita la foto al editar. Una receta admite hasta 5 fotos: la portada en `coverImageUrl` y hasta 4 más en `galleryImageUrls` (tabla `recipe_images`, en orden; si falta la portada, la primera de la galería toma su lugar; al editar, omitir el campo conserva la galería y `[]` la vacía). `GET /recipes/:id` las devuelve en `galleryImageUrls`. `POST /media/profile-images` (cualquier sesión) recibe además `"kind": "avatar" | "cover"` y firma la subida en `users/<id>/`.

### Fotos de recetas (Cloudflare R2)

En el formulario se eligen varias fotos a la vez; cada una pasa por un modal de encuadre (`PhotoCropModal`, con `react-easy-crop`, proporción fija 4:3, arrastrar y zoom) y solo se sube lo encuadrado. La primera es la portada y se puede cambiar con "Hacer portada". El detalle muestra la foto grande con miniaturas (`RecipeGallery`) y el feed la portada en 4:3, igual que el recorte. El navegador reduce la foto a 1600 px por lado y la codifica en WebP (JPEG si no hay WebP), pide la URL prefirmada al backend y la sube directo al bucket con `PUT`; el backend nunca recibe el archivo. Las fotos se sirven desde el dominio público del bucket. Variables: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` (token "Object Read & Write" limitado al bucket), `R2_BUCKET` y `R2_PUBLIC_URL` (sin barra final). El bucket necesita una política CORS que permita `PUT` con el encabezado `Content-Type` desde el origen del frontend (`https://memoriadelcomal.com` y `http://localhost:3000`). Al cambiar o quitar una foto, el archivo anterior queda en el bucket.

Configuración por entorno validada al arrancar en `backend/src/config/env.validation.ts`; el consumo se hace con `configService.getOrThrow(...)`. No se queman valores en el código.

## Modelo de datos

Esquema en `backend/src/database/schema/schema.ts`:

1. `users`: identidad Google OAuth, avatar, nombre, teléfono privado y rol (`USER`, `CONTRIBUTOR`, `ADMIN`).
2. `recipes`: título, porciones, tiempos, dificultad, instrucciones JSONB y ciclo de vida (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`) y `review_notes` con las observaciones del administrador. `source_type` (`REFERENCE`, `INTERVIEW`, `COMMUNITY`), `source_name` y `source_url` registran la procedencia de cada receta y se muestran en la ficha. Índices para feed (`status, createdAt DESC`), autor y región.
3. `ingredients` y `recipe_ingredients`: catálogo normalizado y relación N:M para el algoritmo de coincidencia por ingredientes.
4. `recipe_reactions`: unicidad usuario-receta e índices de agregación.
5. `recipe_bookmarks`: recetario personal con unicidad usuario-receta.
6. `recipe_comments`: un nivel de respuestas (`parent_id`) e índices cronológicos.
7. `contributor_requests`: solicitudes del rol de colaborador (`PENDING`, `APPROVED`, `REJECTED`) con motivación, motivo de rechazo, quién y cuándo la revisó. Un índice único parcial permite una sola solicitud pendiente por usuario.
8. `user_follows`: seguimiento entre usuarios; clave primaria (`follower_id`, `followed_id`), índice por seguido y restricción que impide seguirse a sí mismo.
9. `recipe_images`: fotos adicionales de una receta (la portada sigue en `recipes.cover_image_url`); `position` ordena la galería, con índice único (`recipe_id`, `position`) y borrado en cascada con la receta.

## Convenciones del proyecto

Las directrices completas están en `AGENTS.md`. Resumen:

- pnpm exclusivo; prohibido `npm` y `yarn`.
- TypeScript estricto; prohibido `any`. Un `any` hace fallar el linteo.
- Sin emojis en código, documentación ni control de versiones.
- Diseño cálido de base crema y arena (fondo `#F8F1E5`, tarjetas `#FFFCF6`; la escala `zinc` de Tailwind está reasignada a tonos arena) con un acento: Brasa (`#C2410C`) en la acción principal, el foco y la reacción activa; verde, rojo y ámbar solo para estados (`StatusBadge`, `Notice`, variantes `success`/`danger` de `Button`), siempre con ícono y texto. `rounded-full` solo en avatares; prohibido `uppercase`. Micro animaciones sutiles (presionar botones, entrada de tarjetas, modales, comentarios y rebote de la reacción) con solo `transform` y opacidad, que se reducen a un fundido con `prefers-reduced-motion`. Los botones de la barra lateral y de la barra inferior (`NavHighlight`) toman un tinte arena al pasar el cursor, y la sección actual se marca con una tarjeta clara, una barra Brasa y el ícono en Brasa. Los encabezados de pantalla llevan una franja fina de tejido a color como divisor. El detalle de receta permite marcar ingredientes y pasos, activar el modo cocina (mantiene la pantalla encendida donde el navegador lo permite) y ver más recetas de la misma región; la tarjeta del feed permite guardar y la búsqueda muestra una barra con el porcentaje disponible. La columna derecha muestra las tendencias de Jutiapa y los cocineros recomendados; las cargas se ven con esqueletos y las listas vacías con un mensaje y el siguiente paso. Cada página tiene su propio título y, al compartir una receta, la vista previa muestra su nombre y su foto; el 404 está en español. Cada receta se puede descargar en PDF o imprimir con el cuadro de impresión del sistema (solo la receta, sin menús). Al publicar, la app confirma y abre la receta creada. Guardar, compartir y seguir muestran un aviso breve de confirmación, el texto mínimo es de 12 px y hay un enlace "Saltar al contenido" para quien navega con teclado. Guardadas y los perfiles muestran las recetas en cuadrícula de fotos, y Publicar se llena por secciones numeradas con una vista previa de la tarjeta. El ocre y la franja de tejido a color (`TextileBand`) solo decoran la portada de invitados y los divisores finos. Fuera de esos acentos, la pieza con color propio es el isotipo: un comal de barro sobre el fuego con una franja de tejido (`BrandMark`, que muestra `public/brand/comal.png` con fondo transparente). Los íconos de la PWA (`public/icons/`, incluido el adaptable con el dibujo dentro de la zona segura) y el favicon salen de la misma imagen; al cambiarlos se sube `CACHE_VERSION` en `sw.js`.
- Tipografía: los `h1`, los títulos de receta y el nombre de la marca usan la serifa Lora (`next/font`, clase `font-serif`); el resto, la fuente del sistema. Las recetas sin foto muestran `RecipeCoverPlaceholder` (patrón de tejido `TextilePattern` con el título) en el feed y el detalle. Las tarjetas se elevan con sombra y borde al pasar el mouse; `hoverOnlyWhenSupported` evita que `hover:` se quede pegado al tocar en el celular. El feed muestra a los invitados la portada `FeedWelcome`, con accesos a buscar por ingredientes y a iniciar sesión.
- Commits con Conventional Commits (`tipo(scope): resumen`), resumen y cuerpo en español e imperativo. Tipos: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, `style`.
- Prohibido incluir trailers `Co-Authored-By` o cualquier atribución a un agente en commits o Pull Request. El autor es siempre el desarrollador humano.

## Despliegue en Railway

Proyecto `athletic-celebration`, región `us-west2` (la misma de Postgres), tres servicios. Los comandos se configuran en cada servicio (Railway dejó obsoleto `railway.json`); el Root Directory es la raíz del repo porque lo necesita el workspace de pnpm.

| Servicio | Build | Start | Healthcheck | Dominio |
|---|---|---|---|---|
| `api` (NestJS) | `pnpm --filter backend build` | `pnpm --filter backend start:prod` | `/api/recipes/feed` | `api.memoriadelcomal.com` |
| `web` (Next.js) | `pnpm --filter frontend build` | `pnpm --filter frontend start` | `/` | `memoriadelcomal.com` |
| `Postgres` | imagen de Railway | | | |

- `api`: `NODE_ENV=production` (cookie `secure`, sin `dev-login`), `DATABASE_URL=${{Postgres.DATABASE_URL}}` con `DATABASE_SSL=false` (red privada), `JWT_SECRET` propio de producción, `FRONTEND_URL=https://memoriadelcomal.com` `GOOGLE_CALLBACK_URL=https://api.memoriadelcomal.com/api/auth/google/callback` y las `R2_*` con `R2_PUBLIC_URL=https://img.memoriadelcomal.com`. Railway inyecta `PORT`.
- `web`: `NEXT_PUBLIC_API_URL=https://api.memoriadelcomal.com/api` (se lee en el build).
- Frontend y API comparten dominio, así que la cookie de sesión (`sameSite: lax`) funciona sin cambios. Usar el dominio sin `www`: CORS acepta un solo origen.
- DNS en Cloudflare en modo "DNS only". El push a `main` no despliega solo: después se lanza `railway service redeploy --service <api|web> --from-source --yes`.
- Las migraciones se aplican desde local con `pnpm --filter backend db:migrate` antes de desplegar.
