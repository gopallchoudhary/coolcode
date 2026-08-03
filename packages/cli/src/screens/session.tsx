import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import type { InferResponseType } from "hono/client";

import { SessionShell } from "../components/session-shell";
import { UserMessage, BotMessage, ErrorMessage } from "../components/messages";
import { useToast } from "../providers/toast";
import { apiClient } from "../lib/api-client";
import { useKeyboardLayer } from "../providers/keyboard-layer";
import { getErrorMessages } from "../lib/http-errors";

type SessionData = InferResponseType<
	(typeof apiClient.sessions)[":id"]["$get"],
	200
>;

const sessionLocationSchema = z.object({
	session: z.custom<SessionData>(
		(val) => val != null && typeof val === "object" && "id" in val,
	),
});

function ChatMessage({ msg }: { msg: SessionData["messages"][number] }) {
	const role = msg.role?.toUpperCase();

	if (role === "USER") {
		return <UserMessage message={msg.content} />;
	}

	if (role === "ERROR") {
		return <ErrorMessage message={msg.content} />;
	}

	return <BotMessage content={msg.content} model={msg.model} />;
}

export function Session() {
	const { id } = useParams();
	const toast = useToast();
	const location = useLocation();
	const navigate = useNavigate();

	const prefetched = useMemo(() => {
		
		const parsed = sessionLocationSchema.safeParse(location.state);
		return parsed.success ? parsed.data.session : null;
	}, [location.state]);

	const [session, setSession] = useState<SessionData | null>(prefetched);

	useEffect(() => {
		if (prefetched) return;

		setSession(null);

		if (!id) return;

		let ignore = false;

		const fetchSession = async () => {
			try {
				const res = await apiClient.sessions[":id"].$get({
					param: { id },
				});

				if (ignore) return;

				if (!res.ok) {
					throw new Error(await getErrorMessages(res));
				}

				const resolved = await res.json();
				setSession(resolved);
			} catch (error) {
				if (ignore) return;
				toast.show({
					variant: "error",
					message:
						error instanceof Error
							? error.message
							: "Failed to load the session",
				});

				navigate("/", { replace: true });
			}
		};

		fetchSession();
		return () => {
			ignore = true;
		};
	}, [id, prefetched, toast, navigate]);

	if (!session) {
		return <SessionShell onSubmit={() => {}} inputDisabled />;
	}

	return (
		<SessionShell onSubmit={() => {}} inputDisabled>
			{session.messages.map((msg) => (
				<ChatMessage key={msg.id} msg={msg} />
			))}
		</SessionShell>
	);
}
