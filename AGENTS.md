# Directrices del Proyecto Recetario Jutiapa (Antigravity Memory)

## 1. Gestor de Paquetes Exclusivo
- **pnpm:** Todo comando de instalación, compilación, ejecución o linteo DEBE ejecutarse con `pnpm` (`pnpm install`, `pnpm add`, `pnpm run`, etc.).
- Prohibido utilizar `npm` o `yarn`.

## 2. Fuente de Verdad
- El documento académico y de requerimientos `Entrega I part2.md` es la fuente de verdad del sistema (búsqueda inteligente por ingredientes, repositorio de recetas tradicionales de Jutiapa, comunidad y roles).
- Debe mantenerse siempre en `.gitignore`.

## 3. Calidad de Código y Tipado
- TypeScript Estricto.
- **Prohibición absoluta de `any`:** Ningún archivo debe contener `any`. Se aplica la regla `@typescript-eslint/no-explicit-any: ["error"]`.

## 4. Sistema de Diseño (UI/UX)
- **Paleta Monocromática:** Solo blanco (`#FFFFFF`), negro (`#000000`, `#0A0A0A`) y escala zinc (`#E4E4E7`, `#27272A`, `#09090B`, `#F4F4F5`). Prohibidos acentos cromáticos o colores primarios.
- **Geometría:** Botones, modales y tarjetas con bordes ligeramente redondeados (máximo 6px-8px: `rounded-md` o `rounded-lg`).
- **Avatares:** Es el ÚNICO elemento con permiso de usar `rounded-full`.
- **Tipografía:** Geist o Inter. TERMINANTEMENTE PROHIBIDO el uso de `uppercase` o texto en mayúsculas sostenidas. Todo texto debe estar en Sentence case o Title case.

## 5. Arquitectura
- **Frontend:** Next.js App Router con Vertical Slice Architecture en `src/features/`.
  - Cada slice se organiza en `api/`, `components/`, `hooks/`, `types.ts` e `index.ts` (barril con la API pública del slice).
  - Prohibido dejar monolitos en `app/**/page.tsx`: cada página solo renderiza el componente `Screen` de su slice.
  - Lo transversal (UI base, tipos de dominio compartidos, `apiClient`) vive en `src/shared/`.
- **Backend:** NestJS modular con Drizzle ORM sobre PostgreSQL 16+ en Railway con conexión SSL forzada (`sslmode=require`). Prohibido TypeORM.

## 6. Control de Versiones
- **Formato:** Conventional Commits obligatorio. `tipo(scope): resumen en español`, resumen en imperativo y minúscula inicial. Tipos permitidos: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`, `style`. El `scope` es opcional pero recomendado (`frontend`, `backend`, `auth`, `recipes`, ...).
- **Idioma:** El resumen y el cuerpo del commit y de los Pull Request se redactan en español, en imperativo (`agrega`, `corrige`, `refactoriza`).
- **Responsabilidad:** El agente crea los commits como parte de la entrega de cada implementación cuando el usuario pide subir cambios.
- **Autoría:** PROHIBIDO agregar trailers de co-autoría (`Co-Authored-By`) o cualquier atribución al agente en los mensajes de commit o PR. El autor es siempre el desarrollador humano.
- **Alcance:** Un commit por unidad lógica de trabajo; no mezclar cambios ajenos (por ejemplo frontend) con el trabajo en curso.

## 7. Prohibición de Emojis
- **Ningún emoji** ni icono decorativo en código, comentarios, documentación (`README.md`, `AGENTS.md`, `CLAUDE.md`), mensajes de commit ni descripciones de PR.
- Encabezados Markdown planos.

## 8. Configuración por Entorno (Backend)
- **Prohibido quemar valores de entorno.** Ningún `||` ni `?? 'valor'` como respaldo de una variable dentro del código.
- El contrato vive en `backend/src/config/env.validation.ts` y se valida al arrancar vía `ConfigModule.forRoot({ validate })`. Falla el arranque si una variable está ausente, tiene formato inválido o conserva texto de plantilla.
- El consumo se hace siempre con `configService.getOrThrow(...)`, nunca `.get(...)`.
- `drizzle.config.ts` valida por separado con `requireEnv()` (corre fuera de Nest).
- Plantilla obligatoria: `backend/.env.example`. Al agregar una variable, actualizar la clase `EnvironmentVariables`, `.env.example` y el punto de lectura.

## 9. Documentación Viva
- `README.md` y `CLAUDE.md` se refuerzan conforme crece el proyecto: cada módulo, endpoint o decisión de arquitectura nueva se refleja ahí en la misma edición que la introduce.
