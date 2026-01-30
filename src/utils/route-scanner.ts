import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import type { RouteConfig, RouteModule } from "./types";

/**
 * Scans the routes directory and builds a route configuration map
 * @param routesDir - Absolute path to the routes directory
 * @returns Object mapping route patterns to their handlers
 */
export async function scanRoutes(routesDir: string): Promise<Record<string, any>> {
    const routes: Record<string, any> = {};
    const routeConfigs = await discoverRoutes(routesDir);

    for (const config of routeConfigs) {
        const { pattern, handlers } = config;

        // If there's only one method, use it directly
        const methods = Object.keys(handlers);
        if (methods.length === 1) {
            routes[pattern] = handlers[methods[0] as keyof typeof handlers];
        } else {
            // Multiple methods - create an object with method handlers
            routes[pattern] = handlers;
        }
    }

    return routes;
}

/**
 * Recursively discovers all route files in the routes directory
 */
async function discoverRoutes(
    routesDir: string,
    baseDir: string = routesDir
): Promise<RouteConfig[]> {
    const configs: RouteConfig[] = [];

    try {
        const entries = readdirSync(routesDir);

        for (const entry of entries) {
            const fullPath = join(routesDir, entry);
            const stat = statSync(fullPath);

            if (stat.isDirectory()) {
                // Recursively scan subdirectories
                const subConfigs = await discoverRoutes(fullPath, baseDir);
                configs.push(...subConfigs);
            } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
                // Process route file
                const config = await processRouteFile(fullPath, baseDir);
                if (config) {
                    configs.push(config);
                }
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not scan routes directory: ${error}`);
    }

    return configs;
}

/**
 * Processes a single route file and extracts its configuration
 */
async function processRouteFile(
    filePath: string,
    baseDir: string
): Promise<RouteConfig | null> {
    try {
        // Import the route module
        const module = (await import(filePath)) as RouteModule;

        // Extract HTTP method handlers
        const handlers: RouteConfig["handlers"] = {};
        const methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"] as const;

        for (const method of methods) {
            if (typeof module[method] === "function") {
                handlers[method] = module[method];
            }
        }

        // Skip if no handlers found
        if (Object.keys(handlers).length === 0) {
            return null;
        }

        // Convert file path to URL pattern
        const pattern = filePathToPattern(filePath, baseDir);

        return {
            pattern,
            filePath,
            handlers,
        };
    } catch (error) {
        console.error(`Error loading route file ${filePath}:`, error);
        return null;
    }
}

/**
 * Converts a file path to a URL pattern
 * Examples:
 *   src/routes/index.ts -> /
 *   src/routes/about.ts -> /about
 *   src/routes/api/users.ts -> /api/users
 *   src/routes/api/users/[id].ts -> /api/users/:id
 *   src/routes/blog/[slug].ts -> /blog/:slug
 */
function filePathToPattern(filePath: string, baseDir: string): string {
    // Get relative path from base directory
    let relativePath = relative(baseDir, filePath);

    // Remove file extension
    relativePath = relativePath.replace(/\.(ts|tsx)$/, "");

    // Handle index files
    if (relativePath.endsWith("/index") || relativePath === "index") {
        relativePath = relativePath.replace(/\/?index$/, "");
    }

    // Convert [param] to :param for dynamic routes
    relativePath = relativePath.replace(/\[([^\]]+)\]/g, ":$1");

    // Convert to URL pattern
    let pattern = "/" + relativePath.split(sep).join("/");

    // Clean up double slashes
    pattern = pattern.replace(/\/+/g, "/");

    // Ensure pattern starts with /
    if (!pattern.startsWith("/")) {
        pattern = "/" + pattern;
    }

    // Handle root route
    if (pattern === "/" || pattern === "") {
        return "/";
    }

    return pattern;
}

/**
 * Utility to print discovered routes (for debugging)
 */
export function printRoutes(routes: Record<string, any>): void {
    console.log("\n📍 Discovered routes:");
    const patterns = Object.keys(routes).sort();

    for (const pattern of patterns) {
        const route = routes[pattern];
        if (typeof route === "function") {
            console.log(`  ${pattern}`);
        } else if (typeof route === "object") {
            const methods = Object.keys(route).join(", ");
            console.log(`  ${pattern} [${methods}]`);
        }
    }
    console.log();
}
