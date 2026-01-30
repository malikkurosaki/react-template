/**
 * API route: /api/users
 * Example CRUD endpoint demonstrating multiple HTTP methods
 */

// In-memory storage for demo purposes
const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
];

/**
 * GET /api/users - List all users
 */
export async function GET(req: Request) {
    return Response.json({
        users,
        count: users.length,
    });
}

/**
 * POST /api/users - Create a new user
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newUser = {
            id: users.length + 1,
            name: body.name,
            email: body.email,
        };
        users.push(newUser);

        return Response.json(
            {
                message: "User created successfully",
                user: newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}
