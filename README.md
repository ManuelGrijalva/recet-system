# Red Social Gastronómica Tradicional de Jutiapa (MVP)

Plataforma comunitaria para la difusión y el rescate de la gastronomía tradicional del departamento de Jutiapa, Guatemala, con un motor de búsqueda inteligente por ingredientes disponibles. Proyecto de graduación para la Universidad Mariano Gálvez de Guatemala, Campus Jutiapa.

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

Requisitos: Node.js 20+, pnpm 10+ o 12+, y una base PostgreSQL 16+ accesible por SSL.

```bash
pnpm install
cp backend/.env.example backend/.env   # completar los valores reales
pnpm --filter backend db:push
pnpm --filter backend start:dev        # API en http://localhost:4000/api
pnpm --filter frontend dev             # Web en http://localhost:3000
```

## Comandos

| Acción | Comando |
|---|---|
| Instalar dependencias del workspace | `pnpm install` |
| Frontend en desarrollo | `pnpm --filter frontend dev` |
| Backend NestJS en watch | `pnpm --filter backend start:dev` |
| Chequeo de tipos del frontend | `pnpm --filter frontend typecheck` |
| Linteo estricto (cero `any`) | `pnpm lint` |
| Generar migraciones Drizzle | `pnpm --filter backend db:generate` |
| Aplicar migraciones Drizzle | `pnpm --filter backend db:push` |

## Stack tecnológico

| Capa | Tecnología | Detalle |
|---|---|---|
| Frontend | Next.js 15 (App Router) | React 19, Vertical Slice Architecture |
| Estilos | Tailwind CSS 3 | Paleta monocromática estricta (blanco, negro, `zinc`) |
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
│   └── src/
│       ├── common/         Decoradores, filtros y guards
│       ├── config/         Validación de variables de entorno al arranque
│       ├── database/       Conexión SSL y esquema Drizzle
│       └── modules/        auth, users, recipes, interactions
├── frontend/               Web Next.js (App Router)
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

Slices migrados a la fecha: `recipe-feed`, `reactions`. Pendientes: `recipe-detail`, `recipe-compose`, `ingredient-search`, `saved-recipes`, `profile`, `auth`, `comments`.

### Layout responsivo

- Móvil: barra de navegación inferior fija, feed a una columna, modales tipo bottom sheet.
- Escritorio: barra lateral izquierda fija (`w-64`), feed central `max-w-2xl`, barra lateral derecha (`lg:` en adelante) con sugerencias y tendencias.

## Arquitectura del backend

Módulos en `backend/src/modules/`, cada uno con `*.controller.ts`, `*.service.ts` y `dto/`:

- `auth`: Google OAuth 2.0, emisión de JWT en cookie HTTP-Only, `dev-login` para desarrollo.
- `users`: perfil privado (`/users/me`) y público (`/users/:id`); el teléfono es privado y editable.
- `recipes`: alta de recetas, feed paginado (`/recipes/feed`), búsqueda (`/recipes/search`), detalle y borrado.
- `interactions`: reacciones (`LIKE`, `YUMMY`, `TRIED_IT`), guardados y comentarios con un nivel de hilo.

Configuración por entorno validada al arrancar en `backend/src/config/env.validation.ts`; el consumo se hace con `configService.getOrThrow(...)`. No se queman valores en el código.

## Modelo de datos

Esquema en `backend/src/database/schema/schema.ts`:

1. `users`: identidad Google OAuth, avatar, nombre, teléfono privado y rol (`USER`, `CONTRIBUTOR`, `ADMIN`).
2. `recipes`: título, porciones, tiempos, dificultad, instrucciones JSONB y ciclo de vida (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`). Índices para feed (`status, createdAt DESC`), autor y región.
3. `ingredients` y `recipe_ingredients`: catálogo normalizado y relación N:M para el algoritmo de coincidencia por ingredientes.
4. `recipe_reactions`: unicidad usuario-receta e índices de agregación.
5. `recipe_bookmarks`: recetario personal con unicidad usuario-receta.
6. `recipe_comments`: un nivel de respuestas (`parent_id`) e índices cronológicos.

## Convenciones del proyecto

Las directrices completas están en `AGENTS.md`. Resumen:

- pnpm exclusivo; prohibido `npm` y `yarn`.
- TypeScript estricto; prohibido `any`. Un `any` hace fallar el linteo.
- Sin emojis en código, documentación ni control de versiones.
- Diseño monocromático (blanco, negro, `zinc`); `rounded-full` solo en avatares; prohibido `uppercase`.
- Commits y descripciones de PR en español, en imperativo, con el trailer `Co-Authored-By`.
