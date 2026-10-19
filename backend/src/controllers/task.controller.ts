import type { Request, Response, NextFunction } from "express";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title, description, priority, dueDate } = req.body;
    const vendorId = String(req.params.id);

    if (!title || typeof title !== "string") {
      res.status(400).json({
        success: false,
        message: "Task title is required",
      });
      return;
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
      return;
    }

    if (priority && !Object.values(TaskPriority).includes(priority)) {
      res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
      return;
    }

    const parsedDueDate = dueDate ? new Date(dueDate) : undefined;

    if (dueDate && Number.isNaN(parsedDueDate?.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
      return;
    }

    const task = await prisma.task.create({
      data: {
        vendorId,
        title,
        description,
        priority: priority ?? TaskPriority.MEDIUM,
        dueDate: parsedDueDate,
      },
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function getVendorTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendorId = String(req.params.id);

    const tasks = await prisma.task.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const taskId = String(req.params.id);
    const { title, description, priority, dueDate, status } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    if (priority && !Object.values(TaskPriority).includes(priority)) {
      res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
      return;
    }

    if (status && !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
      return;
    }

    const data: Record<string, unknown> = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = priority;
    if (status !== undefined) data.status = status;

    if (dueDate !== undefined) {
      const date = dueDate ? new Date(dueDate) : null;

      if (date && Number.isNaN(date.getTime())) {
        res.status(400).json({
          success: false,
          message: "Invalid due date",
        });
        return;
      }

      data.dueDate = date;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}
