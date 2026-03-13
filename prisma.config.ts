import "dotenv/config";
import { defineConfig } from "prisma/config";

if (!process.env.DIRECT_URL) {
  throw new Error("DIRECT_URL is not defined");
}

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
