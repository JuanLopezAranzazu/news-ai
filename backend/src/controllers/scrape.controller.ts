import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { HttpError } from "@/types";
import { prisma } from "@/lib/prisma";
import * as newsService from "@/services/news.service";

export const scrapeOneSource = asyncHandler(async (req: Request, res: Response) => {
  const { sourceId } = req.params;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  const source = await prisma.source.findUnique({ where: { id: sourceId } });
  if (!source) throw new HttpError(404, "Fuente no encontrada");

  const result = await newsService.scrapeAndSaveSource(source, limit);
  res.json({ source: source.name, ...result });
});

export const scrapeAllSources = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const result = await newsService.scrapeAllActiveSources(limit);
  res.json(result);
});
