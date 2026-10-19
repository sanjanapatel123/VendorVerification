import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyCompany } from "../services/company.service.js";
import { Prisma } from "@prisma/client";

export async function verifyVendorCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendorId = String(req.params.id);

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

    const result = await verifyCompany(vendor.companyName);

    const existingVerification = await prisma.verification.findFirst({
      where: {
        vendorId,
        provider: "OPENCORPORATES",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = {
      status: result.status,
      provider: result.provider,
      searchedTerm: result.searchedTerm,
      externalCompanyId: result.externalCompanyId,
      result: result.result
        ? (JSON.parse(JSON.stringify(result.result)) as Prisma.InputJsonValue)
        : Prisma.DbNull,
      errorMessage: result.errorMessage ?? null,
    };

    const verification = existingVerification
      ? await prisma.verification.update({
          where: { id: existingVerification.id },
          data,
        })
      : await prisma.verification.create({
          data: {
            vendorId,
            ...data,
          },
        });

    res.status(200).json({
      success: true,
      message: "Company verification completed",
      verification,
    });
  } catch (error) {
    next(error);
  }
}
