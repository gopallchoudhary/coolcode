import type { ToastContextOptions } from "../../providers/toast";
import type { DialogContextValue } from "../../providers/dialog/index";
import type { Mode } from "@coolcode/database/enums";
import type { SupportedChatModelId } from "@coolcode/shared";

export type CommandContext = {
    exit: () => void,
    toast: ToastContextOptions,
    dialog: DialogContextValue,
    navigate: (path: string) => void,
    mode: Mode,
    setMode: (mode: Mode) => void,
    setModel: (model: SupportedChatModelId) => void,
}

export type Command = {
    name: string;
    description?: string;
    value: string;
    action?: (ctx: CommandContext) => void | Promise<void>
}