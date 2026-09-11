import { Router } from "express";
import * as scrapeController from "@/controllers/scrape.controller";

const router = Router();

router.post("/", scrapeController.scrapeAllSources);
router.post("/:sourceId", scrapeController.scrapeOneSource);

export default router;
