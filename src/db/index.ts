import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/user";
import { env } from "@/lib/env";

/**
 * Connection pool configuration for production
 * @see https://orm.drizzle.team/docs/get-started-postgresql#node-postgres
 */
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Connection pool settings for production
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

/**
 * Drizzle ORM instance with schema and logging
 */
export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

/**
 * Export schema for use in other files
 */
export * from "./schema/user";

/**
 * Type helper for database transactions
 */
export type Database = typeof db;
