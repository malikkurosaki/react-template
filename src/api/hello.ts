/**
 * API route: GET /api/hello
 * Returns a simple hello message
 */
export async function GET(req: Request) {
    return Response.json({
        message: "Hello, world!",
        method: "GET",
    });
}

/**
 * API route: PUT /api/hello
 * Returns a hello message for PUT requests
 */
export async function PUT(req: Request) {
    return Response.json({
        message: "Hello, world!",
        method: "PUT",
    });
}
