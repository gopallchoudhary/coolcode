import type { ToastContextOptions } from "../../providers/toast";
import type { DialogContextValue } from "../../providers/dialog/index";

export type CommandContext = {
    exit: () => void,
    toast: ToastContextOptions,
    dialog: DialogContextValue
}

export type Command = {
    name: string;
    description?: string;
    value: string;
    action?: (ctx: CommandContext) => void | Promise<void>
}