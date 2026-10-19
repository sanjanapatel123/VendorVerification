import { Router } from "express";
import { uploadVendorDocument } from "../controllers/document.controller.js";
import { uploadDocumentFile } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/:id/documents", uploadDocumentFile, uploadVendorDocument);

export default router;
