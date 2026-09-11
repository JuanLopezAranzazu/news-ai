import axios from "axios";
import * as cheerio from "cheerio";
import type { Source } from "@prisma/client";
import type { ScrapedArticle } from "@/types";

const USER_AGENT =
  "Mozilla/5.0 (compatible; NewsScraperBot/1.0; +https://example.com/bot)";

async function fetchHtml(url: string): Promise<string> {
  const { data } = await axios.get<string>(url, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 15000,
  });
  return data;
}

function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

/**
 * Recorre la página de listado de una fuente y devuelve las URLs de artículos
 * encontradas usando el selector configurado en la fuente.
 */
export async function discoverArticleUrls(source: Source, limit = 20): Promise<string[]> {
  if (!source.listSelector) {
    throw new Error(`La fuente "${source.name}" no tiene listSelector configurado`);
  }

  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);

  const urls = new Set<string>();
  $(source.listSelector).each((_, el) => {
    const href = $(el).attr("href");
    if (href) urls.add(resolveUrl(source.url, href));
  });

  return Array.from(urls).slice(0, limit);
}

/**
 * Descarga y extrae el contenido de un artículo individual usando los
 * selectores configurados en la fuente.
 */
export async function scrapeArticle(
  source: Source,
  articleUrl: string
): Promise<ScrapedArticle | null> {
  const html = await fetchHtml(articleUrl);
  const $ = cheerio.load(html);

  const title =
    (source.titleSelector && $(source.titleSelector).first().text().trim()) ||
    $("title").first().text().trim();

  const content = source.contentSelector
    ? $(source.contentSelector)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean)
        .join("\n\n")
    : "";

  if (!title || !content) {
    return null;
  }

  const imageUrl = source.imageSelector
    ? $(source.imageSelector).first().attr("src") ||
      $(source.imageSelector).first().attr("content") ||
      null
    : $('meta[property="og:image"]').attr("content") || null;

  const author = source.authorSelector
    ? $(source.authorSelector).first().text().trim() || null
    : null;

  let publishedAt: Date | null = null;
  if (source.dateSelector) {
    const raw =
      $(source.dateSelector).first().attr("datetime") ||
      $(source.dateSelector).first().text().trim();
    if (raw) {
      const parsed = new Date(raw);
      if (!Number.isNaN(parsed.getTime())) publishedAt = parsed;
    }
  }

  return {
    title,
    url: articleUrl,
    content,
    imageUrl: imageUrl ? resolveUrl(articleUrl, imageUrl) : null,
    author,
    publishedAt,
  };
}

/**
 * Ejecuta el flujo completo: descubre artículos en el listado y scrapea cada uno.
 */
export async function scrapeSource(source: Source, limit = 20): Promise<ScrapedArticle[]> {
  const urls = await discoverArticleUrls(source, limit);
  const results: ScrapedArticle[] = [];

  for (const url of urls) {
    try {
      const article = await scrapeArticle(source, url);
      if (article) results.push(article);
    } catch (err) {
      console.error(`[scraper] Error al scrapear ${url}:`, (err as Error).message);
    }
  }

  return results;
}
