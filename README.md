# Mastra Personal Assistant Demo

> **A lightweight AI-agent-powered personal assistant built with the [Mastra](https://github.com/mastra-ai/mastra) framework. It demonstrates how to compose agents, integrate tools (weather and notes), and configure observability with DuckDB and LibSQL storage.**

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

This repository contains a **Mastra-powered personal assistant application** that exposes a **personal assistant agent** capable of:

* **Fetching current weather** for any city using the free Open-Meteo API.
* **Saving and retrieving notes** stored locally in `src/mastra/public/data/notes.json`.

Observability events, including spans, logs, and metrics, are persisted to a **DuckDB** store, while the main application data lives in a **LibSQL (SQLite)** database.

The application is bundled using the Mastra CLI, producing a ready-to-run production bundle located in `.mastra/output`.

The application runs on **port 4111**.

---

## Features

| Feature               | Description                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| **Agent**             | `personalAssistantAgent` – A Mastra `Agent` with custom instructions and memory for the last 20 messages. |
| **Weather Tool**      | `weatherTool` – Fetches temperature, weather conditions, and a human-readable weather summary.            |
| **Notes Tool**        | `saveNotesTool` – Saves notes with an ID, title, content, and timestamp to a JSON file.                   |
| **Observability**     | Uses `DuckDBStore` for observability data and `LibSQLStore` for core application data.                    |
| **Built-in Storage**  | A composite storage configuration combines LibSQL for application data and DuckDB for observability.      |
| **Zero-config Build** | `npm run build` bundles the application and generates a deployable `.mastra/output` directory.            |
| **Type-Safe**         | Built with TypeScript and configured with strict type checking.                                           |

---

## Prerequisites

| Tool         | Minimum Version                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| **Node.js**  | 18.x or newer                                                                                           |
| **npm**      | 9.x or newer                                                                                            |
| **Git**      | Any recent version                                                                                      |
| **Optional** | `MASTRA_PLATFORM_ACCESS_TOKEN` – Required only for forwarding observability data to the Mastra Platform |

You can also use `pnpm` instead of `npm` if preferred.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/W-Bjwa04/mastra-agent-lab.git
cd mastra-agent-lab
```

### 2. Install Dependencies

```bash
npm install
```

Or, if you use pnpm:

```bash
pnpm install
```

### 3. Install the Mastra CLI Globally (Optional)

```bash
npm install -g @mastra/cli
```

---

## First-Time Build

Run:

```bash
npm run build
```

The build process will:

1. Analyze and optimize dependencies.
2. Bundle the application using the Mastra CLI.
3. Copy required public assets, including `notes.json` and database files, into `.mastra/output`.
4. Install production dependencies inside `.mastra/output`.
5. Generate the required deployment files.

After a successful build, you should see a message similar to:

```text
Build successful, you can now deploy the .mastra/output directory to your target platform.
To start the server, run: node .mastra/output/index.mjs
```

---

## Configuration

### Environment Variables (`.env`)

Create or update the `.env` file in the project root and add the environment variables you need:

```dotenv
# Optional: Mastra Platform token for remote observability dashboards
MASTRA_PLATFORM_ACCESS_TOKEN=your-token-here

# Optional: Override the SQLite database location
# Defaults to the application's configured database location
MASTRA_SQLITE_URL=file:./mastra.db

# Optional: Set a custom service name for observability
OBSERVABILITY_SERVICE_NAME=personal-assistant-demo
```

> **Note:** The weather tool uses the public Open-Meteo API and does **not** require an API key.

---

## TypeScript Configuration

The `tsconfig.json` file is configured for the Mastra framework:

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

This configuration enables:

* Modern ES2022 JavaScript support.
* Node.js type definitions.
* Strict TypeScript type checking.
* Bundler-compatible module resolution.
* Type checking without generating compiled files.

---

## Running the App

### Production Mode

After building the application, start the bundled production server:

```bash
node .mastra/output/index.mjs
```

The Mastra application runs on:

```text
http://localhost:4111
```

Open the following address in your browser:

```text
http://localhost:4111
```

The default application port is **4111**.

---

### Development Mode

For development with hot reloading, run:

```bash
npm run dev
```

This runs:

```bash
mastra dev
```

The development server runs on **port 4111** unless your Mastra configuration overrides the port.

Open:

```text
http://localhost:4111
```

> The development server watches your `src/` files and automatically reloads when changes are detected.

---

## Project Structure

```text
mastra-agent-lab/
├─ .gitignore
├─ .env
├─ package.json
├─ tsconfig.json
├─ src/
│  ├─ mastra/
│  │  ├─ index.ts
│  │  ├─ agents/
│  │  │  ├─ personal-assistant.ts
│  │  │  └─ instructions.ts
│  │  ├─ tools/
│  │  │  ├─ weather-tool.ts
│  │  │  └─ save-note-tool.ts
│  │  └─ public/
│  │     ├─ data/
│  │     │  └─ notes.json
│  │     └─ mastra.db
│  │
│  └─ ... (future modules)
│
├─ .mastra/
│  ├─ output/
│  │  └─ index.mjs
│  └─ bundler-config.mjs
│
└─ README.md
```

### Important Files

| File                                      | Description                                               |
| ----------------------------------------- | --------------------------------------------------------- |
| `src/mastra/index.ts`                     | Creates and configures the Mastra instance and storage.   |
| `src/mastra/agents/personal-assistant.ts` | Defines the personal assistant agent.                     |
| `src/mastra/agents/instructions.ts`       | Contains the agent instructions and prompt configuration. |
| `src/mastra/tools/weather-tool.ts`        | Implements the weather-fetching tool.                     |
| `src/mastra/tools/save-note-tool.ts`      | Implements the note-saving tool.                          |
| `src/mastra/public/data/notes.json`       | Stores saved notes locally.                               |
| `.mastra/output/`                         | Contains the production-ready bundled application.        |

---

## Deploying

The application bundle inside `.mastra/output` is designed for deployment.

After building the application:

```bash
npm run build
```

The production server can be started with:

```bash
node .mastra/output/index.mjs
```

The application listens on **port 4111**.

Make sure your hosting platform exposes or maps **port 4111**.

You can deploy the bundled application to platforms that support Node.js applications, such as:

* Docker
* Railway
* Render
* Any Node.js-compatible hosting platform

---

## Docker Deployment

### Dockerfile

Create a `Dockerfile` in the root of the project:

```dockerfile
# -------------------------------------------------
# Multi-stage Docker build for Mastra application
# -------------------------------------------------

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies and build the application
RUN npm ci && npm run build


# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the production bundle
COPY --from=builder /app/.mastra/output ./

# Mastra application port
EXPOSE 4111

# Start the application
CMD ["node", "index.mjs"]
```

### Build the Docker Image

```bash
docker build -t mastra-demo .
```

### Run the Docker Container

```bash
docker run -p 4111:4111 mastra-demo
```

After starting the container, open:

```text
http://localhost:4111
```

---

## Development Scripts

| Script             | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `npm run dev`      | Starts Mastra in development mode with hot reloading.                    |
| `npm run build`    | Creates a production build and generates the `.mastra/output` directory. |
| `npm run lint`     | Runs linting or formatting if configured.                                |
| `npx tsc --noEmit` | Performs TypeScript type checking without generating files.              |

---

## Troubleshooting & FAQ

### Q: I get a "Top-level await expressions are only allowed..." error

Ensure your `tsconfig.json` contains:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022"
  }
}
```

Then run:

```bash
npx tsc --noEmit
```

---

### Q: Node.js globals such as `process` or modules such as `node:path` are not found

Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

If the issue continues, install the required development dependencies:

```bash
npm install -D typescript @types/node
```

---

### Q: The build hangs on "Installing dependencies"

The Mastra CLI may install production dependencies inside the `.mastra/output` directory during the build process.

Make sure:

* You have a stable internet connection.
* You have enough available disk space.
* Your npm configuration is working correctly.

You can also try:

```bash
npm install
npm run build
```

---

### Q: Where are my notes stored?

Notes are stored locally at:

```text
src/mastra/public/data/notes.json
```

The file may be created automatically when the first note is saved, depending on the implementation of the notes tool.

---

### Q: How do I enable remote observability?

Add your Mastra Platform access token to your `.env` file:

```dotenv
MASTRA_PLATFORM_ACCESS_TOKEN=your-token-here
```

The observability configuration in:

```text
src/mastra/index.ts
```

can then use the configured exporter to forward observability events to the Mastra Platform.

---

### Q: Which port does the application run on?

The Mastra application runs on:

```text
http://localhost:4111
```

The default port used by this project is:

```text
4111
```

For Docker, the port is exposed and mapped using:

```dockerfile
EXPOSE 4111
```

and:

```bash
docker run -p 4111:4111 mastra-demo
```

---

## License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more details.

---

### 🎉 Happy Hacking!

Feel free to open issues or pull requests if you encounter bugs, have ideas for new tools, or want to integrate this assistant into a larger application.

Enjoy building with **Mastra**!
