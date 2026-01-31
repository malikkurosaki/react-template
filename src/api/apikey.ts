/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
import Elysia, { t } from "elysia";
import { nanoid } from "nanoid";
import { prisma } from "../utils/db";

export const apikey = new Elysia({
	prefix: "/apikey",
})
	.get(
		"/",
		async (ctx) => {
			const { set, user } = ctx as any;
			try {
				if (!user) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				const apiKeys = await prisma.apiKey.findMany({
					where: { userId: user.id },
					select: {
						id: true,
						name: true,
						key: true,
						isActive: true,
						expiresAt: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				return { apiKeys };
			} catch (_error) {
				set.status = 500;
				return { error: "Failed to fetch API keys" };
			}
		},
		{
			detail: {
				summary: "Get all API keys",
				description: "Get all API keys",
			},
		},
	)
	.post(
		"/",
		async (ctx) => {
			const { body, set, user } = ctx as any;
			try {
				const { name, expiresAt } = body;

				if (!user) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				// Generate a unique API key
				const apiKeyValue = `sk-${nanoid(32)}`;

				const newApiKey = await prisma.apiKey.create({
					data: {
						name,
						key: apiKeyValue,
						userId: user.id,
						isActive: true,
						expiresAt: expiresAt ? new Date(expiresAt) : null,
					},
					select: {
						id: true,
						name: true,
						key: true,
						isActive: true,
						expiresAt: true,
						createdAt: true,
						updatedAt: true,
					},
				});


				return { apiKey: newApiKey };
			} catch (_error) {
				set.status = 500;
				console.log(_error);
				return { error: "Failed to create API key" };
			}
		},
		{
			body: t.Object({
				name: t.String(),
				expiresAt: t.Optional(t.String()), // ISO date string
			}),
			detail: {
				summary: "Create a new API key",
				description: "Create a new API key",
			},
		},
	)
	.patch(
		"/:id",
		async (ctx) => {
			const { params, body, set, user } = ctx as any;
			try {
				const { id } = params;
				const { isActive, expiresAt } = body;

				console.log("Patch API key called with:", { id, isActive, expiresAt, userId: user?.id });

				if (!user) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				// Verify that the API key belongs to the user
				const apiKey = await prisma.apiKey.findUnique({
					where: { id },
				});

				console.log("Found API key:", apiKey);

				if (!apiKey || apiKey.userId !== user.id) {
					set.status = 403;
					return { error: "Forbidden" };
				}

				const updatedApiKey = await prisma.apiKey.update({
					where: { id },
					data: {
						isActive,
						expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : undefined
					},
					select: {
						id: true,
						name: true,
						key: true,
						isActive: true,
						expiresAt: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				console.log("Updated API key:", updatedApiKey);

				return { apiKey: updatedApiKey };
			} catch (_error) {
				console.log("Error updating API key:", _error);
				set.status = 500;
				return { error: "Failed to update API key" };
			}
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			body: t.Object({
				isActive: t.Boolean(),
				expiresAt: t.Optional(t.Union([t.String(), t.Null()])), // ISO date string or null
			}),
			detail: {
				summary: "Update an API key",
				description: "Update an API key",
			},
		},
	)
	.delete(
		"/:id",
		async (ctx) => {
			const { params, set, user } = ctx as any;
			try {
				const { id } = params;

				if (!user) {
					set.status = 401;
					return { error: "Unauthorized" };
				}

				// Verify that the API key belongs to the user
				const apiKey = await prisma.apiKey.findUnique({
					where: { id },
				});

				if (!apiKey || apiKey.userId !== user.id) {
					set.status = 403;
					return { error: "Forbidden" };
				}

				await prisma.apiKey.delete({
					where: { id },
				});

				return { success: true };
			} catch (_error) {
				set.status = 500;
				return { error: "Failed to delete API key" };
			}
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			detail: {
				summary: "Delete an API key",
				description: "Delete an API key",
			},
		},
	);
