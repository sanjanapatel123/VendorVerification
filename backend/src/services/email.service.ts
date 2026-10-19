import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMissingDocumentEmail(
  recipient: string,
  companyName: string,
  missingDocuments: string[],
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Sanjana <onboarding@resend.dev>",
    to: recipient,
    subject: `Action required: Documents needed for ${companyName}`,
    text: [
      `Hello,`,
      ``,
      `We need the following documents to complete verification for ${companyName}:`,
      ...missingDocuments.map((document) => `- ${document}`),
      ``,
      `Please provide the required documents so we can continue verification.`,
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
