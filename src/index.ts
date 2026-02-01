import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import logger from './utils/logger';
import { apikey } from "./api/apikey";
import { spaRoutes } from "./generated/spa-routes.generated";
import html from "./index.html";
import { apiMiddleware } from "./middleware/apiMiddleware";
import { auth } from "./utils/auth";

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

for (const route of spaRoutes) {
	// exact
	app.get(route, html);
	// children
	app.get(`${route}/*`, html);
}

app.listen(3000, ({ hostname, port }) => {
	logger.info(`🚀 Server running at http://${hostname}:${port}`);
	// logger.info(`📚 Swagger docs at http://${hostname}:${port}/docs`);
});

export type ApiApp = typeof app;
