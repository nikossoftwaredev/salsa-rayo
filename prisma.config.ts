import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("lib", "db", "schema.prisma"),
});
