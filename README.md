# News AI — Noticias con scraping + IA (Groq)

Monorepo con dos apps independientes:

- **backend/** — Node + TypeScript + Express + Prisma + PostgreSQL. Scraping con `axios` + `cheerio`, resumen y clasificación con **Groq** (`openai/gpt-oss-120b`).
- **frontend/** — Nuxt 4 + **Nuxt UI**, responsive, consume la API del backend.

## 1. Backend

```bash
cd backend
cp .env.example .env      # completa DATABASE_URL y GROQ_API_KEY
pnpm install
npx prisma migrate dev --name init
pnpm seed               # crea categorías base y una fuente de ejemplo
pnpm dev                 # http://localhost:4000
```

### Configurar una fuente real

Cada `Source` guarda los selectores CSS que el scraper usa. Edítalos vía Prisma Studio (`pnpm run prisma:studio`) o por API:

```bash
curl -X POST http://localhost:4000/api/sources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "El Diario",
    "url": "https://eldiario.example.com",
    "listSelector": "a.article-link",
    "titleSelector": "h1.headline",
    "contentSelector": "div.article-body p",
    "imageSelector": "meta[property=\"og:image\"]",
    "authorSelector": ".byline .author",
    "dateSelector": "time"
  }'
```

`listSelector` apunta a los `<a>` de la página de listado; el resto de selectores se aplican dentro de cada página de artículo.

### Endpoints principales

| Método | Ruta                         | Descripción                                   |
|--------|------------------------------|------------------------------------------------|
| GET    | `/api/news`                  | Lista paginada (`page`, `pageSize`, `categoryId`, `sourceId`, `search`) |
| GET    | `/api/news/:id`               | Detalle de una noticia                        |
| DELETE | `/api/news/:id`               | Elimina una noticia                           |
| POST   | `/api/news/:id/summarize`     | Regenera resumen + categoría con Groq         |
| POST   | `/api/scrape`                 | Scrapea todas las fuentes activas             |
| POST   | `/api/scrape/:sourceId`       | Scrapea una fuente puntual                    |
| GET/POST | `/api/categories`           | Lista / crea categorías                       |
| GET/POST/PATCH/DELETE | `/api/sources`   | CRUD de fuentes                               |

Activa `ENABLE_SCRAPE_CRON=true` en `.env` para que el scraping corra solo según `SCRAPE_CRON` (cron estándar).

## 2. Frontend

```bash
cd frontend
cp .env.example .env      # ajusta NUXT_PUBLIC_API_BASE si el backend no está en localhost:4000
pnpm install
pnpm dev                 # http://localhost:3000
pnpm build && pnpm preview  # para producción
```

Incluye: grid responsive de noticias, filtro por categoría y búsqueda, vista de detalle con el resumen generado por IA, botón para regenerar resumen/categoría y botón para disparar el scraping desde la UI.

## 3. Notas de arquitectura

- El scraping es **por selectores CSS configurables por fuente** (no hay parsers hardcodeados), así que añadir un nuevo sitio es solo crear un `Source` con los selectores correctos.
- El resumen y la categoría se generan **en un único llamado a Groq** (respuesta JSON) por noticia, para minimizar latencia/costo; el resultado se guarda en `Summary` y actualiza `News.categoryId`.
- Las noticias se deduplican por `url` (constraint `@unique` en Prisma).
- Cada Nuxt page/composable usa `useAsyncData` con SSR, así que la primera carga ya viene con datos.
