// This file tells the Prisma CLI (running from apps/backend) where the shared
// schema lives and where to write generated migrations.
import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: path.resolve(__dirname, "../../packages/database/prisma/schema"),
  migrations: {
    path: path.resolve(__dirname, "../../packages/database/prisma/migrations"),
  },
  datasource: {
    url: process.env["DATABASE_URL"] as string,
  },
});

