import { serve } from "bun";
import index from "./index.html";
import { join } from "node:path";
import { scanRoutes, printRoutes } from "./utils/route-scanner";

// Scan API routes from src/api
const apiDir = join(import.meta.dir, "api");
const apiRoutesRaw = await scanRoutes(apiDir);

// Helper to prepend /api to routes scanned from src/api
// e.g., /users -> /api/users
const apiRoutes = Object.fromEntries(
  Object.entries(apiRoutesRaw).map(([path, handler]) => {
    // If path is root /, map to /api
    const apiPath = path === "/" ? "/api" : `/api${path}`;
    return [apiPath, handler];
  })
);

if (process.env.NODE_ENV !== "production") {
  printRoutes(apiRoutes);
}

const server = serve({
  routes: {
    // 1. Register API Routes
    ...apiRoutes,

    // 2. Serve index.html for all unmatched routes (SPA Fallback)
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
