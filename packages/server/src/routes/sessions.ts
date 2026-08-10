import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
// import { HTTPException } from "hono/http-exception";
import * as Sentry from "@sentry/hono/bun";
import { z } from "zod";
import { db } from "@coolcode/database/client";
import { Role, Mode, MessageStatus } from "@coolcode/database/enums";
import type { AuthenticatedEnv } from "../middleware/requireAuth";
import { requireCreditsBalance } from "../middleware/require-credits-balance";
import { isSupportedChatModel } from "../lib/models";




const createSessionSchema = z.object({
	title: z.string(),
	cwd: z.string().optional(),
	initialMessage: z
		.object({
			role: z.enum(Role),
			content: z.string(),
			mode: z.enum(Mode),
			model: z
				.string()
				.refine(isSupportedChatModel, "Unsupported model"),
		})
		.optional(),
});

const createSessionValidator = zValidator(
	"json",
	createSessionSchema,
	(result, c) => {
		if (!result.success) {
			Sentry.logger.error("Session creation validation failed", {
				path: c.req.path,
				issues: result.error.issues.length,
			});
			return c.json({ error: "Invalid requrest body" }, 400);
		}
	},
);

const app = new Hono<AuthenticatedEnv>()
	.get("/", async (c) => {
		const userId = c.get('userId')
		const sessions = await db.session.findMany({
			orderBy: { createdAt: "desc" },
			where: {
				userId
			},
			select: {
				id: true,
				title: true,
				createdAt: true,
			},
		});

		Sentry.logger.info("Listed sessions", {
			count: sessions.length,
		});

		return c.json(sessions);
	})
	.get("/:id", async (c) => {
		// await new Promise((r) => setTimeout(r, 5000));

		// throw new HTTPException(500, {
		// 	message: "Mock error: session loading failed",
		// });

		const id = c.req.param('id')
		const userId = c.get('userId')
		const session = await db.session.findUnique({
			where: { id, userId },
			include: {
				messages: { orderBy: { createdAt: "asc" } }
			}
		});

		if (!session) {
			Sentry.logger.warn("Session not found", {
				sessionId: id,
				userId
			});

			return c.json({ error: "Session not found" }, 404)
		}

		Sentry.logger.info("Loaded session", {
			sessionId: id,
			messageCount: session.messages.length,
		});

		return c.json(session)
	})
	.post('/', requireCreditsBalance,  createSessionValidator, async (c) => {
		// await new Promise((r) => setTimeout(r, 5000))
		const { initialMessage, ...data } = c.req.valid('json')
		const userId = c.get('userId')

		const session = await db.session.create({
			data: {
				...data,
				userId,
				...(initialMessage && {
					messages: {
						create: {
							...initialMessage,
							status: MessageStatus.COMPLETE,
						}
					}
				})
			},
			include: {
				messages: true
			}
		})

		Sentry.logger.info("Created session", {
			sessionId: session.id,
			title: session.title,
		});

		return c.json(session, 201)
	})

export default app