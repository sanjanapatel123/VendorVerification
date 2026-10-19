import express from "express";
import cors from "cors";
import helmet from "helmet";

import vendorRoutes from "./routes/vendor.routes.js";
import documentRoutes from "./routes/document.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import taskRoutes from "./routes/task.routes.js";
import versionRoutes from "./routes/version.routes.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Vendor Verification API is running",
  });
});

app.use("/api/vendors", vendorRoutes);
app.use("/api/vendors", documentRoutes);
app.use("/api/vendors", verificationRoutes);
app.use("/api/vendors", taskRoutes);
app.use("/api/vendors", versionRoutes);
app.use("/api/vendors", emailRoutes);

app.use(
  (
    err: Error & { status?: number },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.message);

    res.status(err.status ?? 500).json({
      success: false,
      message:
        err.status && err.status < 500 ? err.message : "Internal server error",
    });
  },
);

export default app;
