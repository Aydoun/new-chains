import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  //   migrations: {
  //     // keep ts-node if you want; Prisma's examples often use tsx, but it's not mandatory
  //     seed: "ts-node prisma/seed.ts",
  //   },
  datasource: {
    url: env("DATABASE_URL"),
    // shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL, // if you use it
  },
});
