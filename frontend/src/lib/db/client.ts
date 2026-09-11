import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local (see .env.example)."
  );
}

// Supabaseのコネクションプーラー(pgbouncer)経由で使う場合、
// prepared statementに対応していないため prepare:false が必須
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);
