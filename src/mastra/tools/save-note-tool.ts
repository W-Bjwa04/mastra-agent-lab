import { createTool } from "@mastra/core/tools";
import { join } from "node:path";
import z from "zod";
import fs from "node:fs";

const NOTES_FILE = join(process.cwd(), "data/notes.json");

type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export const saveNotesTool = createTool({
    id: "save-notes-tool",
    description: "Save a note or reminder. Use when the user wants to save something for future reference",
    // FIX 1: Removed 'id' from inputSchema since the system generates it internally
    inputSchema: z.object({
        title: z.string().describe("The title of the note"),
        content: z.string().describe("The content of the note"),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
        noteId: z.string().optional(),
        error: z.string().optional()
    }),

    execute: async ({ title, content }) => {

        try {
            let existingNotes: Note[] = [];

            // 1. Read existing notes file if it exists, or create the directory structure
            try {
                // Ensure the 'data' directory exists
                await fs.promises.mkdir(join(process.cwd(), "data"), { recursive: true });

                const fileContent = await fs.promises.readFile(NOTES_FILE, "utf-8");
                existingNotes = JSON.parse(fileContent);
                if (!Array.isArray(existingNotes)) {
                    existingNotes = [];
                }
            } catch (readError) {
                // If file doesn't exist, start with an empty array
                existingNotes = [];
            }

            // 2. Create the new note record
            const newNote: Note = {
                id: crypto.randomUUID(),
                title,
                content,
                createdAt: new Date().toISOString()
            };

            existingNotes.push(newNote);

            await fs.promises.writeFile(NOTES_FILE, JSON.stringify(existingNotes, null, 2));

            return {
                success: true,
                message: "Note saved successfully",
                noteId: newNote.id
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to save note",
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
});
