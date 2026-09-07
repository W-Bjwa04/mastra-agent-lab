import { Mastra } from "@mastra/core";
import { personalAssistantAgent } from "./agents/personal-assistant";
import { LibSQLStore } from '@mastra/libsql'
import { DuckDBStore } from "@mastra/duckdb";
import { MastraCompositeStore } from '@mastra/core/storage'
import {
    Observability,
    MastraStorageExporter,
    MastraPlatformExporter,
    SensitiveDataFilter,
} from '@mastra/observability'

export const mastra = new Mastra({
    agents: { personalAssistantAgent },
    storage: new MastraCompositeStore({
        id: 'composite-storage',
        default: new LibSQLStore({
            id: 'mastra-storage',
            url: 'file:./mastra.db',
        }),
        domains: {
            observability: new DuckDBStore().observability,
        },
    }),

    observability: new Observability({
        configs: {
            default: {
                serviceName: 'agentic-ai-first-lab',
                exporters: [
                    new MastraStorageExporter(), // Persists observability events to Mastra Storage
                    new MastraPlatformExporter(), // Sends observability events to Mastra platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
                ],
                spanOutputProcessors: [
                    new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
                ],
                logging: {
                    enabled: true,
                    level: 'info',
                },
            },
        },
    }),
});
