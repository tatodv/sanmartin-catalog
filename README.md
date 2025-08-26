# Formación en San Martín

Proyecto web estático construido con Next.js (App Router) y TailwindCSS.

## Datos
- Fuente única de datos: `app/(data)/catalog.json`.
- Antes de desplegar, enriquecer el catálogo ejecutando:
  ```bash
  pnpm build:cat
  ```
  Este script utiliza `scripts/build_catalog.ts` y `app/(data)/taxonomy.json` para completar campos canónicos.

## Desarrollo
1. Instalar dependencias con `pnpm install` (ya ejecutado en este entorno).
2. Levantar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
3. Visitar `http://localhost:3000`.

## Deploy en Vercel
1. Ejecutar `pnpm build:cat` y commitear los datos actualizados.
2. Subir cambios al repositorio.
3. En Vercel, configurar el proyecto para usar `pnpm` y el comando de build por defecto (`pnpm build`).

