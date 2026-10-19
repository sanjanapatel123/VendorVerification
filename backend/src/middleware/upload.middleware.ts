import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";

const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? "uploads");
mkdirSync(uploadDir, { recursive: true });

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, uniqueName);
  },
});

export const uploadDocumentFile = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP and PDF files are allowed"));
    }
    cb(null, true);
  },
}).single("document");
