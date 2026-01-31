import { createFileRoute } from "@tanstack/react-router";
import { protectedRouteMiddleware } from "../middleware/authMiddleware";

export const Route = createFileRoute("/settings")({
	beforeLoad: protectedRouteMiddleware,
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<div>
			<h1>Settings</h1>
		</div>
	);
}
