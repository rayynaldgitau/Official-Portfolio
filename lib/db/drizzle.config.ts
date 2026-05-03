import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/index.ts", // Point this exactly to where your pgTable definitions are
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
