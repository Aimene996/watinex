#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const migrationsDir = resolve(projectRoot, "db", "migrations");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required to run migrations.");
  process.exit(1);
}

function runPsql(args) {
  return execFileSync("psql", args, {
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
}

function runSql(sql) {
  return runPsql([
    databaseUrl,
    "-v",
    "ON_ERROR_STOP=1",
    "-X",
    "-q",
    "-t",
    "-A",
    "-c",
    sql,
  ]);
}

try {
  runSql(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const files = readdirSync(migrationsDir)
    .filter((file) => /^\d{14}_[a-z0-9_]+\.sql$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.log("No migration files found in db/migrations.");
    process.exit(0);
  }

  for (const file of files) {
    const [version] = file.split("_");
    const applied = runSql(
      `SELECT 1 FROM schema_migrations WHERE version = '${version}' LIMIT 1;`
    ).trim();

    if (applied === "1") {
      console.log(`Skipping ${file} (already applied).`);
      continue;
    }

    const filePath = resolve(migrationsDir, file);

    console.log(`Applying ${file} ...`);
    runSql("BEGIN;");
    try {
      runPsql([
        databaseUrl,
        "-v",
        "ON_ERROR_STOP=1",
        "-X",
        "-q",
        "-f",
        filePath,
      ]);
      runSql(
        `INSERT INTO schema_migrations (version, name) VALUES ('${version}', '${file.replace(/'/g, "''")}');`
      );
      runSql("COMMIT;");
      console.log(`Applied ${file}.`);
    } catch (error) {
      runSql("ROLLBACK;");
      throw error;
    }
  }

  console.log("Migration run completed.");
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown migration error.";
  console.error(message);
  process.exit(1);
}
