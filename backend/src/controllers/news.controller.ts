import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { HttpError } from "@/types";
import * as newsService from "@/services/news.service";
import { processNewsWithAi } from "@/services/ai.service";

export const getNews = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize, categoryId, sourceId, search } = req.query;

  const result = await newsService.listNews({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    categoryId: categoryId ? String(categoryId) : undefined,
    sourceId: sourceId ? String(sourceId) : undefined,
    search: search ? String(search) : undefined,
  });

  res.json(result);
});

export const getNewsById = asyncHandler(async (req: Request, res: Response) => {
  const news = await newsService.getNewsById(req.params.id);
  if (!news) throw new HttpError(404, "Noticia no encontrada");
  res.json(news);
});

export const removeNews = asyncHandler(async (req: Request, res: Response) => {
  await newsService.deleteNews(req.params.id);
  res.status(204).send();
});

export const regenerateSummary = asyncHandler(async (req: Request, res: Response) => {
  const news = await newsService.getNewsById(req.params.id);
  if (!news) throw new HttpError(404, "Noticia no encontrada");

  const updated = await processNewsWithAi(req.params.id);
  res.json(updated);
});
