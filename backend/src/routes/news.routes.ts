import { Router } from "express";
import * as newsController from "@/controllers/news.controller";

const router = Router();

router.get("/", newsController.getNews);
router.get("/:id", newsController.getNewsById);
router.delete("/:id", newsController.removeNews);
router.post("/:id/summarize", newsController.regenerateSummary);

export default router;
