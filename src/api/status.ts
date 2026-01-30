/**
 * API route: /api/status
 * Returns server status and uptime
 */
export async function GET(req: Request) {
    return Response.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: "Server is running with file-based routing! 🚀",
    });
}
