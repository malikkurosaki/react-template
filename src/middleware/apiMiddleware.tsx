import type Elysia from "elysia";
import logger from '@/utils/logger';
import { auth } from "@/utils/auth";
import { prisma } from "@/utils/db";

export function apiMiddleware(app: Elysia) {
	return app
		.derive(async ({ request }) => {
			const headers = request.headers;

			// First, try to get user from session (Better Auth)
			const userSession = await auth.api.getSession({
				headers,
			});

			if (userSession?.user) {
				// Return user data from session if authenticated via session
				return {
					user: {
						...userSession.user,
						id: userSession.user.id,
						email: userSession.user.email,
						name: userSession.user.name,
						image: userSession.user.image,
						emailVerified: userSession.user.emailVerified,
						role: userSession.user.role || "user",
					},
				};
			}

			// If no session, try API key authentication
			let apiKey = headers.get("x-api-key");

			if (!apiKey) {
				// Also check Authorization header for API key
				const authHeader =
					headers.get("authorization") || headers.get("Authorization");
				if (authHeader?.startsWith("Bearer ")) {
					apiKey = authHeader.substring(7);
				}
			}

			if (!apiKey) {
				return { user: null };
			}

			try {
				// Look up the API key in the database
				const apiKeyRecord = await prisma.apiKey.findFirst({
					where: {
						key: apiKey,
						isActive: true,
					},
					include: {
						user: true, // Include the associated user
					},
				});

				if (!apiKeyRecord) {
					return { user: null };
				}

				// Return the associated user data
				return {
					user: {
						id: apiKeyRecord.user.id,
						email: apiKeyRecord.user.email,
						name: apiKeyRecord.user.name,
						image: apiKeyRecord.user.image,
						emailVerified: apiKeyRecord.user.emailVerified,
						role: apiKeyRecord.user.role || "user",
					},
				};
			} catch (err) {
				logger.warn({ err }, '[AUTH] Error verifying API key');
				return { user: null };
			}
		})
		.onBeforeHandle(({ user, set, request }) => {
			if (!user) {
				logger.warn(`[AUTH] Unauthorized: ${request.method} ${request.url}`);
				set.status = 401;
				return { message: "Unauthorized" };
			}
		});
}
