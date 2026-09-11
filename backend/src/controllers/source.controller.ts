import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/lib/prisma";

export const listSources = asyncHandler(async (_req: Request, res: Response) => {
  const sources = await prisma.source.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { news: true } } },
  });
  res.json(sources);
});

export const createSource = asyncHandler(async (req: Request, res: Response) => {
  const source = await prisma.source.create({ data: req.body });
  res.status(201).json(source);
});

export const updateSource = asyncHandler(async (req: Request, res: Response) => {
  const source = await prisma.source.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(source);
});

export const deleteSource = asyncHandler(async (req: Request, res: Response) => {
  await prisma.source.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
