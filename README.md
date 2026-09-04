```text
█▀▀ █▀█ █▀█ █   █▀▀ █▀█ █▀▄ █▀▀
█▄▄ █▄█ █▄█ █▄▄ █▄▄ █▄█ █▄▀ ██▄
```

# coolcode

> coolcode — the powerful terminal AI coding agent.

coolcode is an AI coding agent that lives in your terminal. A native TUI,
built with OpenTUI and React, talks to a Hono API server backed by Postgres.
The model streams tool calls over the wire; the CLI executes them locally,
inside your project. It plans before it builds — and shows every step as it
happens.

## [+] Features

- `[+]` **Terminal-native** — a real TUI rendered with `@opentui/react`, not a web view.
- `[+]` **Plans before it builds** — `PLAN` mode is read-only and enforced on both the server and the CLI. Review the approach before a single file changes.
- `[+]` **Executes tools locally** — tool calls run inside your working directory, sandboxed to your project.
- `[+]` **Streams everything** — tokens, tool calls, and results arrive in real time; results are returned to the model automatically.
- `[+]` **Multi-model** — a shared model registry routes through OpenRouter. Swap models without leaving the prompt (`gpt-5.4` by default, see `packages/shared/src/models.ts`).
- `[+]` **Sessions that persist** — conversations and history live in Postgres, not in your scrollback.

## Quickstart

Prerequisites: [Bun](https://bun.sh) 1.x, a local PostgreSQL instance, an
`OPENROUTER_API_KEY`, and Clerk keys for auth.

```bash
git clone https://github.com/gopallchoudhary/coolcode
cd coolcode
bun install
```

`bun install` runs `prisma generate` as a `postinstall` step of
`@coolcode/database` — anything importing that package will not compile
without it.

Create a `.env` at the repository root (see
[Configuration](#configuration)), then push the schema — no migrations are
tracked:

```bash
cd packages/database
bunx prisma db push
```

Run the API server (it listens on port 3000):

```bash
bun run dev:server
```

In a second terminal, launch the TUI:

```bash
bun run dev:cli
```

To install the CLI globally, build it and link the `coolcode` bin:

```bash
bun run build:cli
bun run link:cli
```

## Configuration

One `.env` at the repository root serves the whole stack. Bun auto-loads it;
the Prisma CLI loads it through `prisma.config.ts`.

### Server

| Variable                 | Required | Notes                                                     |
| ------------------------ | -------- | --------------------------------------------------------- |
| `DATABASE_URL`           | yes      | Postgres connection string                                 |
| `CLERK_SECRET_KEY`       | yes      | Missing keys throw at import time in `packages/server/src/lib/auth.ts` |
| `CLERK_PUBLISHABLE_KEY`  | yes      | Clerk OAuth                                                |
| `OPENROUTER_API_KEY`     | yes      | Routes chat models through OpenRouter                      |
| `POLAR_ACCESS_TOKEN`     | yes      | Credits and billing via Polar                              |
| `POLAR_PRODUCT_ID`       | yes      | Polar product for credit packs                             |
| `POLAR_CREDITS_METER_ID` | yes      | Meter used to record per-message usage                     |
| `POLAR_SERVER`           | no       | Defaults to the Polar sandbox                              |

### CLI

| Variable                | Required | Notes                               |
| ----------------------- | -------- | ----------------------------------- |
| `API_URL`               | no       | Defaults to `http://localhost:3000` |
| `CLERK_FRONTEND_API`    | yes      | Clerk frontend API URL              |
| `CLERK_OAUTH_CLIENT_ID` | yes      | Clerk OAuth client                  |

## How it works

- `[1]` **Start the API** — the Hono server handles auth, sessions, credits, and model routing.
- `[2]` **Launch the TUI** — the CLI connects to the API and opens the chat interface in your terminal.
- `[3]` **Ship code** — ask for a change. The agent streams tool calls, the CLI executes them in your repo, and results return automatically.

Tool contracts are shared by `packages/shared` (`getToolContracts(mode)`):

| Mode    | Tools                                                          |
| ------- | -------------------------------------------------------------- |
| `PLAN`  | `readFile` · `listDirectory` · `glob` · `grep`                  |
| `BUILD` | everything in `PLAN`, plus `writeFile` · `editFile` · `bash`    |

`PLAN` mode is enforced twice: the server only ever sends the read-only
contracts, and the CLI refuses write tools even if it receives them.

## Repo layout

```text
packages/cli       Terminal UI (@opentui/react) + local tool execution
packages/server    Hono API — auth, sessions, chat, billing (port 3000)
packages/database  Prisma 7 client over Postgres
packages/shared    Model registry, BUILD/PLAN mode schema, AI tool contracts
apps/web           Nextra docs site
```

## Docs

The full usage guide lives in `apps/web`. Run it locally:

```bash
bun run dev:web
```

Then open <http://localhost:3000/docs> — Introduction, Getting started,
Configuration, CLI & tools, and Architecture.

## License

No license has been selected yet. All rights reserved until one is added.
