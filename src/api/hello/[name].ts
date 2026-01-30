/**
 * API route: GET /api/hello/:name
 * Returns a personalized hello message
 */
export async function GET(req: Request) {
    const name = req.params.name;
    return Response.json({
        message: `Hello, ${name}!`,
    });
}
