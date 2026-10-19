import { Router } from "express";
import {
  createTask,
  getVendorTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.post("/:id/tasks", createTask);
router.get("/:id/tasks", getVendorTasks);
router.patch("/tasks/:taskId", updateTask);

export default router;
