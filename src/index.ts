import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { apikey } from "./api/apikey";
import { spaRoutes } from "./generated/spa-routes.generated";
import { apiMiddleware } from "./middleware/apiMiddleware";
import { auth } from "./utils/auth";
import logger from "./utils/logger";

const api = new Elysia({
	prefix: "/api",
})
	.all("/auth/*", ({ request }) => auth.handler(request))
	.use(cors())
	.use(
		swagger({
			path: "/docs",
			documentation: {
				info: {
					title: "Bun + React API",
					version: "1.0.0",
				},
			},
		}),
	)
	.get("/session", async ({ request }) => {
		const data = await auth.api.getSession({ headers: request.headers });
		return { data };
	})
	.use(apiMiddleware)
	.use(apikey);

const app = new Elysia().use(api);

const isDev = process.env.NODE_ENV === "development";
const PORT = isDev ? 3001 : 3000;

if (!isDev) {
	// Production: Serve static files from dist/
	app.use(
		staticPlugin({
			assets: "dist",
			prefix: "/",
		}),
	);

	// Fallback to index.html for SPA routes
	for (const route of spaRoutes) {
		app.get(route, () => Bun.file("dist/index.html"));
		app.get(`${route}/*`, () => Bun.file("dist/index.html"));
	}

	// Catch-all for any route (SPA fallback)
	app.get("/*", () => Bun.file("dist/index.html"));
} else {
	// Development: Routes are handled by Vite on port 3000
	// This backend only serves API on port 3001
}

app.listen(PORT, ({ hostname, port }) => {
	logger.info(`🚀 Server running at http://${hostname}:${port}`);
	if (process.env.NODE_ENV === "development") {
		logger.info(
			`📝 In development: Frontend served by Vite at http://localhost:3000`,
		);
		logger.info(`🔧 Backend API available at http://localhost:${port}/api`);
	}
	// logger.info(`📚 Swagger docs at http://${hostname}:${port}/docs`);
});

export type ApiApp = typeof app;
