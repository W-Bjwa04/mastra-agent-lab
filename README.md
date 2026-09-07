# Mastra Personal Assistant Demo

> **A lightweight AI‑agent powered personal assistant built with the **[Mastra](https://github.com/mastra-ai/mastra)** framework. It demonstrates how to compose agents, plug‑in tools (weather & notes), and configure observability with DuckDB and LibSQL storage.**

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the App](#running-the-app)
7. [Project Structure](#project-structure)
8. [Deploying](#deploying)
9. [Development Scripts](#development-scripts)
10. [Troubleshooting & FAQ](#troubleshooting--faq)
11. [License](#license)

---

## Overview

This repository contains a **single‑page Mastra application** that exposes a **personal‑assistant agent** capable of:

* **Fetching current weather** for any city (via the free Open‑Meteo API).
* **Saving & retrieving notes** stored locally in `src/mastra/public/data/notes.json`.

Observability events (spans, logs, metrics) are persisted to a **DuckDB** store, while the main user data lives in a **LibSQL** (SQLite) file. The app is bundled with Mastra’s CLI, producing a ready‑to‑run `node .mastra/output/index.mjs` bundle.

---

## Features

| Feature | Description |
|---------|-------------|
| **Agent** | `personalAssistantAgent` – a Mastra `Agent` with a custom prompt and memory (last 20 messages). |
| **Weather Tool** | `weatherTool` – fetches temperature, condition description, and a human‑readable weather string. |
| **Notes Tool** | `saveNotesTool` – saves a note (id, title, content, timestamp) to a JSON file. |
| **Observability** | Uses `DuckDBStore` for spans/metrics & `LibSQLStore` for core data. Exporters send events to Mastra Platform if a token is provided. |
| **Built‑in Storage** | Composite store combines LibSQL (default) and DuckDB (observability domain). |
| **Zero‑config Build** | `npm run build` bundles everything, installs deps, and produces a deployable `.mastra/output` folder. |
| **Type‑Safe** | Full TypeScript typings; `tsconfig.json` targets ES2022 with Node module resolution. |

---

## Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| **Node.js** | 18.x (or newer) |
| **npm** | 9.x (or newer) – *or* `pnpm` if you prefer it |
| **Git** | Any recent version (for cloning & push) |
| **Optional** | `MASTRA_PLATFORM_ACCESS_TOKEN` – required only if you want to forward observability events to the Mastra cloud platform. |

---

## Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/W-Bjwa04/mastra-agent-lab.git
cd mastra-agent-lab

# 2️⃣ Install dependencies (the build script will re‑install if you run it later)
npm install   # or `pnpm install`

# 3️⃣ Install the Mastra CLI globally (optional but handy)
npm i -g @mastra/cli
```

### First‑time Build (once)

```bash
npm run build
```

The command will:

1. Analyze and optimize dependencies.
2. Bundle the application with the Mastra CLI.
3. Copy public assets (`data/notes.json`, `mastra.duckdb`, etc.) into `.mastra/output`.
4. Install production dependencies inside `.mastra/output`.
5. Generate a fresh `package-lock.json` for deployment.

After a successful build you’ll see:

```
Build successful, you can now deploy the .mastra/output directory to your target platform.
To start the server, run: node .mastra/output/index.mjs
```

---

## Configuration

### Environment Variables (`.env`)

Create a `.env` file in the project root (the one already exists) and add any of the following (only the ones you need):

```dotenv
# Optional: Mastra Platform token for remote observability dashboards
MASTRA_PLATFORM_ACCESS_TOKEN=your-token-here

# Optional: Override the SQLite DB location (defaults to ./mastra.db)
MASTRA_SQLITE_URL=file:./mastra.db

# Optional: Set a custom service name for observability
OBSERVABILITY_SERVICE_NAME=personal-assistant-demo
```

> **Note:** The weather tool uses the public Open‑Meteo API and does **not** require an API key.

### TypeScript Configuration

`tsconfig.json` is already tuned for the Mastra framework:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "types": ["node"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

---

## Running the App

### From the bundled output (production)

```bash
# After `npm run build`
node .mastra/output/index.mjs
```

The server starts on **port 4111** (default Mastra port).
Open your browser at `http://localhost:4111` or interact via the Mastra CLI:

```bash
mastra dev   # starts a hot‑reload dev server (if you prefer dev mode)
```

### Development mode (hot reload)

If you want live editing without rebuilding the bundle each time:

```bash
npm run dev   # runs `mastra dev` under the hood
```

> The dev server watches `src/` files and automatically restarts the agent process.

---

## Project Structure

```
project_mastra/
├─ .gitignore                # ignores node_modules, .env, .mastra/, etc.
├─ .env                      # environment variables (optional)
├─ package.json              # project metadata & scripts
├─ tsconfig.json             # TypeScript compiler options
├─ src/
│  ├─ mastra/
│  │  ├─ index.ts            # Mastra instance + storage config
│  │  ├─ agents/
│  │  │  ├─ personal-assistant.ts   # Agent definition
│  │  │  └─ instructions.ts        # Prompt template
│  │  ├─ tools/
│  │  │  ├─ weather-tool.ts   # Weather fetching tool
│  │  │  └─ save-note-tool.ts # Note‑saving tool
│  │  └─ public/
│  │     ├─ data/
│  │     │  └─ notes.json     # persisted notes
│  │     └─ mastra.db / *.wal # LibSQL & DuckDB files
│  └─ ... (future modules)
├─ .mastra/
│  ├─ output/                # Build output (ready for deployment)
│  └─ bundler-config.mjs     # Mastra bundler configuration (minimal)
└─ README.md                 # <‑‑ you are reading it!
```

---

## Deploying

The bundle in `.mastra/output` is **self‑contained**:

* `node .mastra/output/index.mjs` runs the server without any additional build steps.
* Copy the entire `.mastra/output` folder to your target platform (e.g., a Docker container, Vercel, Railway, or any Node‑compatible host).

### Example Dockerfile

```dockerfile
# -------------------------------------------------
# Multi‑stage Docker build for Mastra app
# -------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.mastra/output ./
EXPOSE 4111
CMD ["node", "index.mjs"]
```

Build & run:

```bash
docker build -t mastra-demo .
docker run -p 4111:4111 mastra-demo
```

---

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts Mastra in development mode with hot‑reloading. |
| `npm run build` | Performs a production build, installs deps, and generates `.mastra/output`. |
| `npm run lint` | (If configured) Runs linting/formatting. |
| `npx tsc --noEmit` | Type‑checking only – useful for CI. |

---

## Troubleshooting & FAQ

**Q: I get “Top‑level await expressions are only allowed …”**
A: Ensure `tsconfig.json` has `"module": "ES2022"` and `"target": "ES2022"` (already set). Re‑run `npx tsc --noEmit` after any config change.

**Q: Node globals like `process` or `node:path` are not found**
A: Add `"types": ["node"]` to `compilerOptions` (already present). If you edited `tsconfig.json`, reinstall TypeScript: `npm i -D typescript @types/node`.

**Q: The build hangs on “Installing dependencies”**
A: The Mastra CLI installs production dependencies inside `.mastra/output`. Ensure you have internet connectivity and enough disk space.

**Q: Where are my notes stored?**
A: `src/mastra/public/data/notes.json`. The file is automatically created on first note save.

**Q: How do I enable remote observability?**
A: Set `MASTRA_PLATFORM_ACCESS_TOKEN` in `.env`. The `Observability` config in `src/mastra/index.ts` already enables the `MastraPlatformExporter`.

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

### 🎉 Happy hacking!

Feel free to open issues or PRs if you encounter bugs, have ideas for new tools, or want to integrate this assistant into a larger application. Enjoy building with **Mastra**!
