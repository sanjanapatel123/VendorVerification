import type { DocumentType } from "@prisma/client";

type VendorFields = {
  companyName: string;
  contactPerson: string;
  registrationNumber: string | null;
  gstNumber: string | null;
  bankAccountNumber: string | null;
  ifscCode: string | null;
};

const fieldsByDocument: Record<DocumentType, string[]> = {
  REGISTRATION_CERTIFICATE: [
    "companyName",
    "registrationNumber",
    "contactPerson",
  ],
  GST_CERTIFICATE: ["companyName", "gstNumber"],
  BANK_DOCUMENT: ["companyName", "bankAccountNumber", "ifscCode"],
  OTHER: [
    "companyName",
    "contactPerson",
    "registrationNumber",
    "gstNumber",
    "bankAccountNumber",
    "ifscCode",
  ],
};

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function compareDocumentFields(
  vendor: VendorFields,
  extracted: Record<string, unknown>,
  type: DocumentType,
) {
  const fields = fieldsByDocument[type];

  return fields.map((field) => {
    const vendorValue = vendor[field as keyof VendorFields];
    const extractedValue = extracted[field];

    let result: "MATCH" | "MISMATCH" | "MISSING";

    if (
      extractedValue === null ||
      extractedValue === undefined ||
      String(extractedValue).trim() === ""
    ) {
      result = "MISSING";
    } else if (normalize(vendorValue) !== normalize(extractedValue)) {
      result = "MISMATCH";
    } else {
      result = "MATCH";
    }

    return {
      field,
      vendorValue: vendorValue ?? null,
      extractedValue: extractedValue ?? null,
      result,
    };
  });
}
