import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/users/$id")({
    component: UserDetailPage,
});

interface User {
    id: number;
    name: string;
    email: string;
}

function UserDetailPage() {
    const { id } = useParams({ from: "/users/$id" }) as { id: string };
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user by ID
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => {
                const foundUser = data.users.find((u: User) => u.id === Number(id));
                setUser(foundUser || null);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="page-container">
                <h1>User Details</h1>
                <p className="loading">Loading user...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page-container">
                <h1>User Not Found</h1>
                <p>User with ID {id} does not exist.</p>
                <Link to="/users" className="back-link">
                    ← Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Link to="/users" className="back-link">
                ← Back to Users
            </Link>

            <div className="user-detail-card">
                <div className="user-detail-avatar">{user.name.charAt(0)}</div>
                <h1>{user.name}</h1>
                <p className="user-email">{user.email}</p>
                <div className="user-meta">
                    <span className="meta-item">
                        <strong>ID:</strong> {user.id}
                    </span>
                </div>
            </div>

            <div className="route-info-box">
                <strong>🛣️ Dynamic Route:</strong> This page uses the route pattern{" "}
                <code>/users/$id</code>
                <br />
                Current parameter: <code>id = {id}</code>
                <br />
                <br />
                Try changing the ID in the URL to see different users!
            </div>
        </div>
    );
}
