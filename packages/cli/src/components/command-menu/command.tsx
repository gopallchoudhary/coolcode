import { SUPPORTED_CHAT_MODELS } from "@coolcode/shared";
import {
	AgentsDialogContent,
	ModelsDialogContent,
	ThemeDialogContent,
} from "../dialogs/";
import { SessionsDialogContent } from "../dialogs/sessions-dialog";
import type { Command } from "./types";
import { performLogin } from "../../lib/oauth";
import { clearAuth } from "../../lib/auth";

export const COMMANDS: Command[] = [
	{
		name: "new",
		description: "Start a new conversation",
		value: "/new",
		action: (ctx) => {
			ctx.navigate("/");
		},
	},

	{
		name: "agents",
		description: "Switch agents",
		value: "/agents",
		action: (ctx) => {
			ctx.dialog.open({
				title: "Select Agent",
				children: (
					<AgentsDialogContent
						currentMode={ctx.mode}
						onSelectMode={ctx.setMode}
					/>
				),
			});
		},
	},
	{
		name: "models",
		description: "Select AI model for generation",
		value: "/models",
		action: (ctx) => {
			ctx.dialog.open({
				title: "Select Model",
				children: (
					<ModelsDialogContent
						models={SUPPORTED_CHAT_MODELS.map((model) => model.id)}
						onSelectModel={ctx.setModel}
					/>
				),
			});
		},
	},
	{
		name: "sessions",
		description: "Browse past sessions",
		value: "/sessions",
		action: (ctx) => {
			ctx.dialog.open({
				title: "Select session",
				children: <SessionsDialogContent />,
			});
		},
	},
	{
		name: "theme",
		description: "Change color theme",
		value: "/theme",
		action: (ctx) => {
			ctx.dialog.open({
				title: "Select theme",
				children: <ThemeDialogContent />,
			});
		},
	},
	{
		name: "login",
		description: "Sign in with your browser",
		value: "/login",
		action: async (ctx) => {
			ctx.toast.show({ message: "Opening browser to sign in..." });

			try {
				await performLogin();
				ctx.toast.show({ message: "Signed in!" });
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				ctx.toast.show({
					variant: "error",
					message: `Failed to sign in: ${message}`,
				});
			}
		},
	},
	{
		name: "logout",
		description: "Sign out of your account",
		value: "/logout",
		action: (ctx) => {
			clearAuth();
			ctx.toast.show({ variant: "success", message: "Signed Out." });
		},
	},
	{
		name: "upgrade",
		description: "Buy more credits",
		value: "/upgrade",
		action: (ctx) => {
			ctx.toast.show({
				message: "Opening credits checkout...",
				variant: "success",
			});
		},
	},
	{
		name: "usage",
		description: "Open billing portal in your browser",
		value: "/usage",
		action: (ctx) => {
			ctx.toast.show({
				message: "Opening billing portal...",
				variant: "success",
			});
		},
	},

	{
		name: "exit",
		description: "Quit the application",
		value: "/exit",
		action: (ctx) => {
			ctx.exit();
		},
	},
];
