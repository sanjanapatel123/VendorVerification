import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function getVersionHistory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendorId = String(req.params.id);

    const versions = await prisma.vendorVersion.findMany({
      where: { vendorId },
      orderBy: { version: "desc" },
    });

    res.json({
      success: true,
      count: versions.length,
      versions,
    });
  } catch (error) {
    next(error);
  }
}

export async function restoreVersion(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendorId = String(req.params.id);
    const versionNumber = Number(req.params.version);

    if (!Number.isInteger(versionNumber) || versionNumber < 1) {
      res.status(400).json({
        success: false,
        message: "Invalid version number",
      });
      return;
    }

    const previousVersion = await prisma.vendorVersion.findUnique({
      where: {
        vendorId_version: {
          vendorId,
          version: versionNumber,
        },
      },
    });

    if (!previousVersion) {
      res.status(404).json({
        success: false,
        message: "Version not found",
      });
      return;
    }

    const snapshot = previousVersion.snapshot as Record<string, unknown>;

    const fields = [
      "companyName",
      "contactPerson",
      "email",
      "phone",
      "address",
      "registrationNumber",
      "gstNumber",
      "bankAccountNumber",
      "ifscCode",
      "status",
    ] as const;

    const data: Record<string, unknown> = {};

    for (const field of fields) {
      if (snapshot[field] !== undefined) {
        data[field] = snapshot[field];
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const vendor = await tx.vendor.update({
        where: { id: vendorId },
        data: data as any,
      });

      const latest = await tx.vendorVersion.findFirst({
        where: { vendorId },
        orderBy: { version: "desc" },
      });

      const nextVersion = (latest?.version ?? 0) + 1;

      const version = await tx.vendorVersion.create({
        data: {
          vendorId,
          version: nextVersion,
          snapshot: vendor as any,
          changes: {
            restoredFromVersion: versionNumber,
            restoredAt: new Date().toISOString(),
          },
        },
      });

      return { vendor, version };
    });

    res.json({
      success: true,
      message: `Vendor restored to version ${versionNumber}`,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}
