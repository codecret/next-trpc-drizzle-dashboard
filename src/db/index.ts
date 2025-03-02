import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/user";
import { env } from "@/lib/env";
export const db = drizzle(env.DATABASE_URL, { schema });
