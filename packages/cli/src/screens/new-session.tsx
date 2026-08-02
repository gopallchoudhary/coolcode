import { useEffect } from "react";

import { useNavigate, useLocation } from "react-router";
import { ErrorMessage, BotMessage, UserMessage } from "../components/messages";
import { SessionShell } from "../components/session-shell";

export function NewSession() {
	const navigate = useNavigate();
	const location = useLocation();

	const state = location.state as { message?: string } | null;

	useEffect(() => {
		if (!state?.message) {
			navigate("/", { replace: true });
		}
	}, [state, navigate]);

	if (!state?.message) return null;

	return (
		<SessionShell onSubmit={() => {}} inputDisabled loading>
			<UserMessage message={state.message} />
			<BotMessage
				model="GPT-3.5"
				content="This is a simple text to demonstrate the message layout."
			/>
		</SessionShell>
	);
}
