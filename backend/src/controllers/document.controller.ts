import type { Request, Response, NextFunction } from "express";
import { DocumentType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { extractDocumentData } from "../services/ai.service.js";
import { compareDocumentFields } from "../services/document-verification.service.js";

const validTypes = Object.values(DocumentType);

export async function uploadVendorDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendorId = String(req.params.id);
    const file = req.file;
    const type = req.body.type as DocumentType;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Please upload a document using the document field",
      });
      return;
    }

    if (!validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        message: "Invalid document type",
        allowedTypes: validTypes,
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

    let extractedData = null;
    let extractionError: string | null = null;

    try {
      extractedData = await extractDocumentData(file.path, file.mimetype);
    } catch (error) {
      extractionError =
        error instanceof Error ? error.message : "Extraction failed";
    }

    const comparison = extractedData
      ? compareDocumentFields(
          vendor,
          extractedData as Record<string, unknown>,
          type,
        )
      : [];

    const hasIssues = comparison.some((item) => item.result !== "MATCH");

    if (hasIssues && vendor.status !== "REJECTED") {
      await prisma.vendor.update({
        where: { id: vendorId },
        data: { status: "ACTION_REQUIRED" },
      });
    }

    const document = await prisma.document.create({
      data: {
        vendorId,
        type,
        fileName: file.originalname,
        storedFileName: file.filename,
        mimeType: file.mimetype,
        filePath: file.path,
        extractedData: extractedData ?? undefined,
        extractionError,
      },
    });

    const mismatches = comparison.filter((item) => item.result === "MISMATCH");

    const missingFields = comparison.filter(
      (item) => item.result === "MISSING",
    );

    const verificationStatus =
      mismatches.length > 0
        ? "MISMATCH"
        : missingFields.length > 0
          ? "UNABLE_TO_VERIFY"
          : "VERIFIED";

    const verification = await prisma.verification.create({
      data: {
        vendorId,
        status: verificationStatus,
        provider: "AI_DOCUMENT_COMPARISON",
        searchedTerm: vendor.companyName,
        result: comparison,
        mismatches: [...mismatches, ...missingFields],
      },
    });

    res.status(201).json({
      success: true,
      message: extractionError
        ? "Document uploaded; AI extraction needs attention"
        : "Document uploaded and processed",
      document,
      comparison,
      hasIssues,
      verification,
    });
  } catch (error) {
    next(error);
  }
}
