/**
 * Type definitions for file-based routing system
 */

// Extend Request type to include route params
declare global {
    interface Request {
        params: Record<string, string>;
    }
}


export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

/**
 * Route handler function signature
 */
export type RouteHandler = (req: Request) => Response | Promise<Response>;

/**
 * Route module interface - what each route file should export
 */
export interface RouteModule {
    GET?: RouteHandler;
    POST?: RouteHandler;
    PUT?: RouteHandler;
    DELETE?: RouteHandler;
    PATCH?: RouteHandler;
    HEAD?: RouteHandler;
    OPTIONS?: RouteHandler;
}

/**
 * Internal route configuration
 */
export interface RouteConfig {
    pattern: string;
    filePath: string;
    handlers: {
        [K in HTTPMethod]?: RouteHandler;
    };
}
