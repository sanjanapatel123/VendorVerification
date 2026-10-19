import type { Request, Response, NextFunction } from "express";
import { DocumentType, EmailStatus } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { sendMissingDocumentEmail } from "../services/email.service.js";

const requiredDocuments: DocumentType[] = [
  DocumentType.REGISTRATION_CERTIFICATE,
  DocumentType.GST_CERTIFICATE,
  DocumentType.BANK_DOCUMENT,
];

const documentLabels: Record<DocumentType, string> = {
  REGISTRATION_CERTIFICATE: "Company Registration Certificate",
  GST_CERTIFICATE: "GST Certificate",
  BANK_DOCUMENT: "Bank Document",
  OTHER: "Other Document",
};

export async function sendMissingDocumentsEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const vendorId = String(req.params.id);

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { documents: true },
    });

    if (!vendor) {
      res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
      return;
    }

    const uploadedTypes = new Set(
      vendor.documents.map((document) => document.type),
    );

    const missingDocuments = requiredDocuments
      .filter((type) => !uploadedTypes.has(type))
      .map((type) => documentLabels[type]);

    if (missingDocuments.length === 0) {
      res.json({
        success: true,
        message: "All required document types have been uploaded",
        missingDocuments: [],
      });
      return;
    }

    const idempotencyKey = randomUUID();

    const emailLog = await prisma.emailLog.create({
      data: {
        vendorId,
        documentType: DocumentType.OTHER,
        recipient: vendor.email,
        subject: `Action required: Documents needed for ${vendor.companyName}`,
        idempotencyKey,
        status: EmailStatus.PENDING,
      },
    });

    try {
      const result = await sendMissingDocumentEmail(
        vendor.email,
        vendor.companyName,
        missingDocuments,
      );

      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: EmailStatus.SENT,
          providerId: result?.id ?? null,
          sentAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: "Missing document email sent",
        missingDocuments,
      });
    } catch (emailError) {
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: EmailStatus.FAILED,
          errorMessage:
            emailError instanceof Error
              ? emailError.message
              : "Email sending failed",
        },
      });

      throw emailError;
    }
  } catch (error) {
    next(error);
  }
}
