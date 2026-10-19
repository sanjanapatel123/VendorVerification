import { Router } from "express";
import {
  getVersionHistory,
  restoreVersion,
} from "../controllers/version.controller.js";

const router = Router();

router.get("/:id/versions", getVersionHistory);
router.post("/:id/versions/:version/restore", restoreVersion);

export default router;
