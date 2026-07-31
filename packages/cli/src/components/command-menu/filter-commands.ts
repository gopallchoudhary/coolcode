import { COMMANDS } from "./command";
import type { Command } from "./types";

export const getFilteredCommands = (query: string): Command[] => {
    if(query.length === 0) {
        return COMMANDS;
    }

    return COMMANDS.filter((cmd) => cmd.name.toLowerCase().includes(query.toLowerCase()))
}
