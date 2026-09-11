import { Router } from "express";
import * as sourceController from "@/controllers/source.controller";

const router = Router();

router.get("/", sourceController.listSources);
router.post("/", sourceController.createSource);
router.patch("/:id", sourceController.updateSource);
router.delete("/:id", sourceController.deleteSource);

export default router;
