import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/users/")({
	component: UsersPage,
});

interface User {
	id: number;
	name: string;
	email: string;
}

function UsersPage() {
	const [users, _] = useState<User[]>([]);

	return (
		<div className="page-container">
			<h1>Users</h1>
			<p className="page-description">
				This page demonstrates fetching data from the API and using dynamic
				routes.
			</p>

			<div className="users-grid">
				{users.map((user) => (
					<Link
						key={user.id}
						to="/users/$id"
						params={{ id: String(user.id) }}
						className="user-card"
					>
						<div className="user-avatar">{user.name.charAt(0)}</div>
						<div className="user-info">
							<h3>{user.name}</h3>
							<p>{user.email}</p>
						</div>
						<div className="user-arrow">→</div>
					</Link>
				))}
			</div>

			<div className="route-info-box">
				<strong>💡 Tip:</strong> Click on a user to see dynamic routing in
				action!
				<br />
				Route pattern: <code>/users/$id</code>
			</div>
		</div>
	);
}
