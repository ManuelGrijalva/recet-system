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
- **Backend:** NestJS modular con Drizzle ORM sobre PostgreSQL 16+ en Railway con conexión SSL forzada (`sslmode=require`). Prohibido TypeORM.
