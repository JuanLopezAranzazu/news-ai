import { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { prisma } from "@/lib/prisma";

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { news: true } } },
  });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body as { name: string };
  const category = await prisma.category.create({ data: { name } });
  res.status(201).json(category);
});
