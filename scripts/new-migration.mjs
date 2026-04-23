#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const nameArg = process.argv[2];

if (!nameArg) {
  console.error("Usage: npm run db:migration:new -- <migration_name>");
  process.exit(1);
}

const sanitized = nameArg
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "_")
  .replace(/^_+|_+$/g, "");

if (!sanitized) {
  console.error("Migration name must contain letters or numbers.");
  process.exit(1);
}

const now = new Date();
const timestamp = [
  now.getUTCFullYear().toString(),
  String(now.getUTCMonth() + 1).padStart(2, "0"),
  String(now.getUTCDate()).padStart(2, "0"),
  String(now.getUTCHours()).padStart(2, "0"),
  String(now.getUTCMinutes()).padStart(2, "0"),
  String(now.getUTCSeconds()).padStart(2, "0"),
].join("");

const migrationsDir = resolve(process.cwd(), "db", "migrations");
mkdirSync(migrationsDir, { recursive: true });

const filename = `${timestamp}_${sanitized}.sql`;
const filepath = resolve(migrationsDir, filename);
const template = `-- ${sanitized}\n-- Write SQL statements below.\n`;

writeFileSync(filepath, template, "utf8");
console.log(`Created ${filename}`);
