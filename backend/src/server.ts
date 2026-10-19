import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = Number(process.env.PORT ?? 5000);

async function start() {
  await prisma.$connect();
  console.log("PostgreSQL connected successfully");
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start API:", error);
  process.exit(1);
});

async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
