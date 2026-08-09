import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import sessions from './routes/sessions'
import chat from './routes/chat'
import auth from './routes/auth'
import { sentry } from "@sentry/hono/bun";
import * as Sentry from "@sentry/hono/bun";
import { requireAuth } from "./middleware/requireAuth";
const app = new Hono();

app.use(
	sentry(app, {
		dsn: "https://c4c8cade84002dcd3a34583f7c348554@o4511845470830592.ingest.us.sentry.io/4511845501763584",
		tracesSampleRate: 1.0,
		enableLogs: true,
		dataCollection: {
		},
	}),
);

app.get("/debug-sentry", () => {
	// Send a log before throwing the error
	Sentry.logger.info('User triggered test error', {
		action: 'test_error_endpoint',
	});
	// Send a test metric before throwing the error
	Sentry.metrics.count('test_counter', 1);
	throw new Error("My first Sentry error!");
});

app.onError((error, c) => {
	if (error instanceof HTTPException) {
		Sentry.logger.warn("Handled HTTP Error", {
			status: error.status,
			message: error.message,
			path: c.req.path,
			method: c.req.method,
		})

		return c.json(
			{ error: error.message || "Request failed" },
			error.status,
		);
	}

	Sentry.logger.error("Unhandled server error", {
		path: c.req.path,
		method: c.req.method,
		message: error instanceof Error ? error.message : 'Unknown error',
	});
	return c.json({ error: "Internal server error" }, 500);
});

app.use("/sessions/*", requireAuth)
app.use("/chat/*", requireAuth)

const routes = app
	.route("/auth", auth)
	.route("/sessions", sessions)
	.route("/chat", chat)

export type AppType = typeof routes

// idletimeout must be high otherwise LLM tool might not be complete
export default { port: 3000, fetch: app.fetch, idleTimeout: 255 };
