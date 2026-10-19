import { Router } from "express";
import { sendMissingDocumentsEmail } from "../controllers/email.controller.js";

const router = Router();

router.post("/:id/missing-documents-email", sendMissingDocumentsEmail);

export default router;
