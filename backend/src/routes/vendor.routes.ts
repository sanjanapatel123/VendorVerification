import { Router } from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  updateVendorStatus,
} from "../controllers/vendor.controller.js";

const router = Router();

router.post("/", createVendor);
router.get("/", getVendors);
router.get("/:id", getVendorById);
router.patch("/:id", updateVendor);
router.delete("/:id", deleteVendor);
router.patch("/:id/status", updateVendorStatus);
export default router;
