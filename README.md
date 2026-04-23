# import-platform

Monorepo: **frontend** (Next.js), **admin** (Next.js), **backend** (Express + Prisma), **Docker** (Postgres + all services).

## Local development

From the repository root:

- `npm install`
- `npm run dev:frontend` — http://localhost:3000
- `npm run dev:admin` — http://localhost:3001
- `npm run dev:backend` — http://localhost:4000 (set `DATABASE_URL` in `apps/backend/.env`; see `apps/backend/.env.example`)

Database migrations use timestamped SQL files in `db/migrations`:
- `npm run db:migration:new -- add_some_change` creates `YYYYMMDDHHmmss_add_some_change.sql`
- `npm run db:migrate` applies pending migrations in order and records them in `schema_migrations`

For quick local UI testing, two starter migrations are included:
- `create_registrations` (core table/indexes/triggers used by frontend + admin)
- `seed_registrations_for_testing` (sample registrations)

Leads: the marketing site posts to `POST /api/leads`. Admin UI (`npm run dev:admin`) calls `GET/PATCH /api/admin/leads` and related routes using the `x-admin-api-key` header. Set `ADMIN_API_KEY` in `apps/backend/.env` (see `apps/backend/.env.example`) and paste the same value into the admin “API key” field.

To create the first admin login for the Supabase-powered dashboard:
- export `SUPABASE_URL` (or reuse `NEXT_PUBLIC_SUPABASE_URL`)
- export `SUPABASE_SERVICE_ROLE_KEY`
- run `npm run admin:create -- admin@your-company.com StrongPassword123!`

Then open the admin app (`npm run dev:admin`) and sign in at `/login`.

## Docker

`docker compose up --build` starts Postgres, API, marketing site, and admin. Ports: **5432**, **4000**, **3000**, **3001**.

If Tailwind native bindings fail after `npm install`, remove `node_modules` and `package-lock.json`, then run `npm install` again (see [npm optional-deps bug](https://github.com/npm/cli/issues/4828)).
# watinex-panel
