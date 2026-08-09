import { readFile, writeFile } from "fs/promises";
import { resolve, relative } from "path";
import { z } from "zod";
import { tool } from "ai";

export function createEditFileTool(cwd: string) {
    return tool({
        description:
            "Make a targeted edit to a file by replacing an exact string match. The old string must appear exactly once in the file (for safety). Use this for surgical edits instead of rewriting the entire files.",
        inputSchema: z.object({
            path: z
                .string()
                .describe("Relative path to the file to edit"),
            oldString: z
                .string()
                .describe("The exact text to find and replace (must be unique in the file)"),
            newString: z
                .string()
                .describe("The text to replace it with"),
        }),
        execute: async ({ path, oldString, newString }) => {
            const resolved = resolve(cwd, path);

            if (!resolved.startsWith(cwd)) {
                return { error: `Path is outside of the project directory` };
            }

            try {
                const content = await readFile(resolved, "utf-8");
                const occurences = content.split(oldString).length - 1

                if (occurences === 0) {
                    return { error: `Old string not found in file` };
                }

                if (occurences > 1) {
                    return { error: `Old string is amiguous - found ${occurences} matches. Provide more surrounding content to make it unique` };
                }

                const updated = content.replace(oldString, newString)
                await writeFile(resolved, updated, "utf-8");

                return {
                    success: true as const,
                    path: relative(cwd, resolved),
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                return { error: `Failed to edit file: ${message}` };
            }
        },
    });
}
