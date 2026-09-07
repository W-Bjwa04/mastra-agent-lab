import { Agent } from "@mastra/core/agent"
import { personalAssistantInstructions } from "./instructions"
import { weatherTool } from "../tools/weather-tool"
import { saveNotesTool } from "../tools/save-note-tool"
import { Memory } from "@mastra/memory"

export const personalAssistantAgent = new Agent({
    id: "perosnal-assistant",
    name: "Personal Assistant",
    instructions: personalAssistantInstructions,
    memory: new Memory({
        options: {
            lastMessages: 20,
        },
    }),
    model: "deepseek/deepseek-v4-flash",
    tools: { weatherTool, saveNotesTool },

}
)