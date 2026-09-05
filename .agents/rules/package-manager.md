# Regla de Gestor de Paquetes (Obligatorio)

- **Gestor Oficial:** `pnpm` (versión ^10.x o ^12.x).
- **Prohibido:** Queda terminantemente prohibido utilizar `npm` o `yarn` para instalar dependencias o ejecutar scripts de forma directa.
- **Comandos Autorizados:**
  - Instalación de dependencias: `pnpm install`
  - Agregar paquetes: `pnpm add <paquete>` o `pnpm add -D <paquete>` (en el directorio correspondiente o usando flags de workspace `-w` / `--filter`)
  - Ejecución de scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`
  - Ejecución de binarios / Drizzle Kit: `pnpm dlx drizzle-kit` o `pnpm exec`
