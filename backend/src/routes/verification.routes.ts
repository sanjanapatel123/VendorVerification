import { Router } from "express";
import { verifyVendorCompany } from "../controllers/verification.controller.js";

const router = Router();

router.post("/:id/verify-company", verifyVendorCompany);

export default router;
