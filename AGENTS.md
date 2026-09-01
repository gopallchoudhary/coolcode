# AGENTS.md

Terminal AI coding agent (OpenCode-style): OpenTUI/React TUI → Hono API → Postgres. Bun workspaces under `packages/*`. No tests, no lint, no CI configured.

## Commands

Run from repo root with Bun:

- `bun install` — also runs `prisma generate` (server `postinstall`); required before anything importing `@coolcode/database` compiles
- `bun run dev:server` — Hono API on port 3000 (hardcoded)
- `bun run dev:cli` — TUI with watch
- `bun run build:cli` / `bun run link:cli` — build to `packages/cli/dist`, then `bun link`
- Regenerate Prisma client: `bun run db:generate` in `packages/database` (client is gitignored at `packages/database/generated/prisma`; no migrations are tracked — use `bunx prisma db push` against a local Postgres)
- No test/lint scripts exist. Best available check: `bunx tsc --noEmit -p packages/server` (clean baseline). `shared` and `database` fail with TS2688 (`"types": ["bun"]` but no `@types/bun` dep), and `cli` has 2 pre-existing errors in `src/hooks/use-chat.ts` (ai@6 vs ai@7 `ToolSet` mismatch) — treat those as baseline noise, not regressions.

## Architecture

- `packages/cli` (`@coolcode/cli`) — terminal UI via `@opentui/react` + `react-router` memory router. Talks to the server using a typed Hono RPC client (`hc<AppType>` from `@coolcode/server`, a devDependency used only for types) plus `DefaultChatTransport` for chat streaming. Auth token injected in `src/lib/api-client.ts`.
- `packages/server` (`@coolcode/server`) — Hono app, exports `AppType`. Routes: auth (Clerk OAuth), billing (Polar), sessions, chat. `requireAuth` on all chat/session/billing routes; `requireCreditsBalance` before chat; usage billed to Polar per message in chat `onFinish`.
- `packages/database` (`@coolcode/database`) — Prisma 7 + `@prisma/adapter-pg` (pg). Import `db` from `@coolcode/database/client`, not the root export.
- `packages/shared` (`@coolcode/shared`) — model registry, `modeSchema` (BUILD/PLAN), and AI tool contracts (`getToolContracts(mode)`) shared by server and CLI.

Chat flow: server `streamText` streams tool calls → **CLI executes tools locally** (`src/lib/local-tools.ts`, cwd-sandboxed) → results returned automatically (`sendAutomaticallyWhen`). PLAN mode is read-only, enforced both server-side and CLI-side.

## Environment

Single `.env` at repo root (Bun auto-loads it from cwd; `prisma.config.ts` also loads it explicitly for Prisma CLI). **`.env.example` is incomplete** — real required vars:

- Server: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `OPENROUTER_API_KEY`, `POLAR_ACCESS_TOKEN`, `POLAR_PRODUCT_ID`, `POLAR_CREDITS_METER_ID` (`POLAR_SERVER` optional, defaults to sandbox)
- CLI: `API_URL` (defaults `http://localhost:3000`), `CLERK_FRONTEND_API`, `CLERK_OAUTH_CLIENT_ID`

Note: `packages/server/src/lib/auth.ts` throws at import time if Clerk keys are missing.

## Gotchas

- **AI SDK version split is intentional as-is**: cli pins `ai@6` + `@ai-sdk/react@3`; server and shared use `ai@7`. Types cross packages via `@coolcode/shared` contracts — don't "align" versions casually.
- CLI JSX uses `jsxImportSource: @opentui/react` — no react-dom, no DOM elements; use OpenTUI components.
- Server `idleTimeout: 255` is deliberately high so long LLM/tool runs aren't cut off — don't lower it.
- 401 responses clear the stored CLI auth token (`clearAuth`) in both the RPC client and chat transport.

## Repo conventions

- Commits use conventional prefixes (`feat:`, `fix:`, `chore:`); work lands via PRs.
- `.agents/rules/graphify.md` (always-on): for architecture questions query `graphify-out/` (`graphify query "..."`), and run `graphify update .` after modifying code files.
- `DESIGN.md` is a design-token spec for the marketing site (used with the frontend-design skill), not app code.
