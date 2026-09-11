import { prisma } from "@/lib/prisma";
import { scrapeSource } from "@/services/scraper.service";
import { processNewsWithAi } from "@/services/ai.service";
import type { Prisma, Source } from "@prisma/client";

export interface ListNewsParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  sourceId?: string;
  search?: string;
}

const newsInclude = {
  source: true,
  category: true,
  summary: true,
} satisfies Prisma.NewsInclude;

export async function listNews(params: ListNewsParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 12));

  const where: Prisma.NewsWhereInput = {
    ...(params.categoryId ? { categoryId: params.categoryId } : {}),
    ...(params.sourceId ? { sourceId: params.sourceId } : {}),
    ...(params.search
      ? {
          OR: [
            { title: { contains: params.search, mode: "insensitive" } },
            { content: { contains: params.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.news.findMany({
      where,
      include: newsInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.news.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getNewsById(id: string) {
  return prisma.news.findUnique({ where: { id }, include: newsInclude });
}

export async function deleteNews(id: string) {
  return prisma.news.delete({ where: { id } });
}

/**
 * Scrapea una fuente, guarda las noticias nuevas (ignora duplicadas por url)
 * y dispara el procesamiento con IA (resumen + categoría) para cada una.
 */
export async function scrapeAndSaveSource(source: Source, limit = 20) {
  const scraped = await scrapeSource(source, limit);

  const created: string[] = [];
  const skipped: string[] = [];

  for (const article of scraped) {
    const existing = await prisma.news.findUnique({ where: { url: article.url } });
    if (existing) {
      skipped.push(article.url);
      continue;
    }

    const news = await prisma.news.create({
      data: {
        title: article.title,
        url: article.url,
        content: article.content,
        imageUrl: article.imageUrl ?? undefined,
        author: article.author ?? undefined,
        publishedAt: article.publishedAt ?? undefined,
        sourceId: source.id,
      },
    });

    created.push(news.id);

    // Procesamiento IA: no bloquea el resto del lote si falla una noticia.
    try {
      await processNewsWithAi(news.id);
    } catch (err) {
      console.error(`[ai] Error procesando noticia ${news.id}:`, (err as Error).message);
    }
  }

  return { createdCount: created.length, skippedCount: skipped.length, createdIds: created };
}

export async function scrapeAllActiveSources(limit = 20) {
  const sources = await prisma.source.findMany({ where: { active: true } });
  const results: Record<string, { createdCount: number; skippedCount: number }> = {};

  for (const source of sources) {
    try {
      results[source.name] = await scrapeAndSaveSource(source, limit);
    } catch (err) {
      console.error(`[scraper] Error en fuente ${source.name}:`, (err as Error).message);
      results[source.name] = { createdCount: 0, skippedCount: 0 };
    }
  }

  return results;
}
