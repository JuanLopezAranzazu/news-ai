import { Router } from "express";
import newsRoutes from "@/routes/news.routes";
import scrapeRoutes from "@/routes/scrape.routes";
import categoryRoutes from "@/routes/category.routes";
import sourceRoutes from "@/routes/source.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));
router.use("/news", newsRoutes);
router.use("/scrape", scrapeRoutes);
router.use("/categories", categoryRoutes);
router.use("/sources", sourceRoutes);

export default router;
