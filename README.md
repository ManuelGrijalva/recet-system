# Red Social Gastronómica Tradicional de Jutiapa (MVP)

Plataforma comunitaria de difusión y rescate de la gastronomía tradicional guatemalteca (departamento de Jutiapa), con motor de búsqueda inteligente por ingredientes disponibles, desarrollada como proyecto de graduación para la Universidad Mariano Gálvez de Guatemala (Campus Jutiapa).

---

## ⚡ Gestor de Paquetes Oficial: `pnpm`

> [!IMPORTANT]
> **Norma de Proyecto:** Este repositorio utiliza **exclusivamente `pnpm`** (versión 10+ / 12+) para la administración de dependencias, scripts de construcción y ejecución de herramientas de desarrollo.
> Queda **estrictamente prohibido** el uso de `npm` o `yarn`.

### Comandos Rápidos con `pnpm`

```bash
# Instalación de todas las dependencias
pnpm install

# Iniciar servidor de desarrollo en frontend
pnpm --filter frontend dev

# Iniciar backend NestJS en modo watch
pnpm --filter backend start:dev

# Ejecutar linteo estricto (cero any)
pnpm lint

# Generar y aplicar migraciones de Drizzle ORM
pnpm --filter backend db:generate
pnpm --filter backend db:push
```

---

## 📖 Fuente de Verdad y Lineamientos

- **Documento Rector:** `Entrega I part2.md` (especificaciones metodológicas, requerimientos funcionales y no funcionales, historias de usuario y modelo de datos relacional).
- **Protección de Fuente:** Este archivo se encuentra protegido e ignorado en el control de versiones a través de `.gitignore`.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión / Detalle |
|---|---|---|
| **Frontend** | Next.js | ^16.x / ^15.5.x LTS con React 19 y App Router |
| **Estilos** | Tailwind CSS | Paleta monocromática estricta en variables CSS |
| **Backend** | NestJS | ^11.x / ^12.x modular estricto |
| **Base de Datos** | PostgreSQL | 16+ alojada en Railway con SSL obligatorio (`sslmode=require`) |
| **ORM** | Drizzle ORM | ^0.39.x con `drizzle-kit` (prohibido TypeORM) |
| **Validación & Calidad** | TypeScript & ESLint | TypeScript en modo estricto; regla `@typescript-eslint/no-explicit-any: ["error"]` |
| **Gestor de Paquetes** | pnpm | Versión ^12.x / ^10.x |

---

## 🎨 Sistema de Diseño Estricto (UI/UX)

1. **Paleta Monocromática:**
   - Tonos base: Blanco puro (`#FFFFFF`), Negro puro (`#000000` / `#0A0A0A`).
   - Tonos intermedios: Escala neutral zinc (`#E4E4E7`, `#27272A`, `#09090B`, `#F4F4F5`).
   - **Prohibición:** Prohibido el uso de colores primarios o acentos cromáticos artificiales.
2. **Geometría de Componentes:**
   - Botones, tarjetas (`cards`), campos de entrada y modales deben poseer bordes con radio máximo de 6px a 8px (`rounded-md` o `rounded-lg`).
   - **Excepción de Avatares:** El avatar de usuario es el **único** elemento autorizado para utilizar `rounded-full`.
3. **Tipografía:**
   - Familia: `Geist` o `Inter`.
   - **Prohibición de Uppercase:** Queda terminantemente prohibido utilizar texto en mayúsculas sostenidas o clases CSS como `uppercase`. Toda interfaz debe redactarse en Sentence case o Title case.

---

## 📱 Arquitectura de Layout Responsivo (Estilo FB / Instagram)

- **Dispositivos Móviles (Mobile-First):**
  - Barra de navegación inferior fija (`fixed bottom-0 left-0 right-0 z-50`).
  - Feed central a 1 columna ocupando todo el ancho.
  - Modales en formato Bottom Sheets o pantalla completa.
- **Dispositivos de Escritorio (Desktop):**
  - Barra lateral izquierda fija con logotipo y enlaces principales (`w-64 fixed left-0`).
  - Feed central optimizado a un ancho máximo de lectura (`max-w-2xl`).
  - Barra lateral derecha fija (`hidden lg:flex w-80 fixed right-0`) con sugerencias de cocineros locales y tendencias culinarias de Jutiapa.

---

## 📂 Estructura Arquitectónica del Repositorio

```text
recet-system/
├── .agents/                     # Reglas de memoria y directrices para Antigravity
│   └── rules/
│       └── package-manager.md   # Definición obligatoria de pnpm
├── backend/                     # Backend NestJS + Drizzle ORM
│   ├── src/
│   │   ├── common/              # Decoradores, filtros y guards
│   │   ├── database/            # Conexión SSL y esquema Drizzle
│   │   │   ├── schema/
│   │   │   │   ├── schema.ts    # Esquema relacional con índices optimizados
│   │   │   │   └── index.ts     # Re-export de tablas y relaciones
│   │   │   └── database.module.ts
│   │   └── modules/             # Auth, Users, Recipes, Interactions
│   ├── drizzle.config.ts        # Configuración de drizzle-kit con sslmode=require
│   └── package.json
├── frontend/                    # Frontend Next.js 16/15 (Vertical Slice)
│   ├── src/
│   │   ├── app/                 # App Router (layout responsivo y páginas)
│   │   │   ├── layout.tsx       # Layout principal con navegación responsiva
│   │   │   └── page.tsx         # Feed de recetas comunitarias
│   │   ├── features/            # Vertical Slices (feed, search, composer, etc.)
│   │   ├── shared/              # Componentes UI (Avatar, Button, etc.)
│   │   └── styles/              # globals.css con variables monocromáticas
│   └── package.json
├── .gitignore                   # Ignora Entrega I part2.md, node_modules, dist
├── AGENTS.md                    # Memoria central del proyecto
├── eslint.config.js             # Flat config de ESLint con prohibición absoluta de any
├── pnpm-workspace.yaml          # Configuración del espacio de trabajo pnpm
└── README.md                    # Documentación central del sistema
```

---

## 🗄️ Esquema de Base de Datos (Drizzle ORM)

El esquema implementado en `backend/src/database/schema/schema.ts` cubre:

1. **`users`:** Identidad Google OAuth 2.0, avatar, nombre, teléfono privado y roles (`USER`, `CONTRIBUTOR`, `ADMIN`).
2. **`recipes`:** Recetas con título, porciones, tiempos, dificultad, instrucciones JSONB estructuradas y ciclo de vida (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`). Incluye índices optimizados para el feed (`status, createdAt DESC`), autor y región.
3. **`ingredients` & `recipe_ingredients`:** Catálogo oficial normalizado y relación N:M para el algoritmo de coincidencia por ingredientes disponibles (según numeral 3.4.2 de `Entrega I part2.md`).
4. **`recipe_reactions`:** Reacciones (`LIKE`, `YUMMY`, `TRIED_IT`) con restricción de unicidad usuario-receta e índices de agregación.
5. **`recipe_bookmarks`:** Recetario personal con unicidad por usuario y receta.
6. **`recipe_comments`:** Comentarios con soporte para 1 nivel de hilo/respuestas (`parent_id`) e índices cronológicos.

---

## 🔒 Regla Estricta de Calidad: Prohibición de `any`

El archivo `eslint.config.js` implementa la prohibición absoluta del tipo `any`:

```javascript
"@typescript-eslint/no-explicit-any": [
  "error",
  {
    fixToUnknown: false,
    ignoreRestArgs: false,
  },
]
```

Cualquier commit o Pull Request que contenga `any` fallará las validaciones de calidad de código.
