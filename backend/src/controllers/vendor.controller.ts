import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function createVendor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      address,
      registrationNumber,
      gstNumber,
      bankAccountNumber,
      ifscCode,
    } = req.body;

    if (!companyName || !contactPerson || !email) {
      res.status(400).json({
        success: false,
        message: "Company name, contact person and email are required",
      });
      return;
    }

    const vendor = await prisma.vendor.create({
      data: {
        companyName,
        contactPerson,
        email,
        phone,
        address,
        registrationNumber,
        gstNumber,
        bankAccountNumber,
        ifscCode,
      },
    });

    res.status(201).json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
}

export async function getVendors(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: vendors.length, vendors });
  } catch (error) {
    next(error);
  }
}

export async function getVendorById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: String(req.params.id) },
      include: {
        documents: true,
        verifications: true,
        tasks: true,
        versions: { orderBy: { version: "desc" } },
      },
    });

    if (!vendor) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
      return;
    }

    res.json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
}

export async function updateVendor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendorId = String(req.params.id);

    const allowedFields = [
      "companyName",
      "contactPerson",
      "email",
      "phone",
      "address",
      "registrationNumber",
      "gstNumber",
      "bankAccountNumber",
      "ifscCode",
    ] as const;

    const data: Record<string, string | null> = {};

    for (const field of allowedFields) {
      const value = req.body[field];

      if (value !== undefined) {
        if (value !== null && typeof value !== "string") {
          res.status(400).json({
            success: false,
            message: `${field} must be a string or null`,
          });
          return;
        }

        data[field] = value;
      }
    }

    if (Object.keys(data).length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.vendor.findUnique({
        where: { id: vendorId },
      });

      if (!current) {
        return null;
      }

      const updated = await tx.vendor.update({
        where: { id: vendorId },
        data,
      });

      const changedFields = Object.keys(data).filter((field) => {
        const oldValue = current[field as keyof typeof current];
        const newValue = updated[field as keyof typeof updated];

        return oldValue !== newValue;
      });

      if (changedFields.length > 0) {
        const latest = await tx.vendorVersion.findFirst({
          where: { vendorId },
          orderBy: { version: "desc" },
        });

        const changes = Object.fromEntries(
          changedFields.map((field) => [
            field,
            {
              oldValue: current[field as keyof typeof current],
              newValue: updated[field as keyof typeof updated],
            },
          ]),
        );

        await tx.vendorVersion.create({
          data: {
            vendorId,
            version: (latest?.version ?? 0) + 1,
            snapshot: updated as any,
            changes,
          },
        });
      }

      return updated;
    });

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
      return;
    }

    res.json({ success: true, vendor: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteVendor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await prisma.vendor.delete({
      where: { id: String(req.params.id) },
    });

    res.json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateVendorStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "DRAFT",
      "UNDER_REVIEW",
      "ACTION_REQUIRED",
      "APPROVED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid vendor status",
        allowedStatuses,
      });
      return;
    }

    const vendor = await prisma.vendor.update({
      where: { id: String(req.params.id) },
      data: { status },
    });

    res.json({ success: true, vendor });
  } catch (error) {
    next(error);
  }
}
