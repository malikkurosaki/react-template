/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
import { protectedRouteMiddleware } from "@/middleware/authMiddleware";
import { authStore } from "@/store/auth";
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
	beforeLoad: protectedRouteMiddleware,
	onEnter({ context }) {
		authStore.user = context?.user as any;
		authStore.session = context?.session as any;
	},
});

function RootComponent() {
	return <Outlet />;
}
