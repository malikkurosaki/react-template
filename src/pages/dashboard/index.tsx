import {
	Avatar,
	Button,
	Card,
	Container,
	Group,
	Text,
	Title,
} from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSnapshot } from "valtio";
import { authClient } from "@/utils/auth-client";
import { authStore } from "../../store/auth";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardComponent,
});

function DashboardComponent() {
	const snap = useSnapshot(authStore);
	const navigate = useNavigate();
	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="lg">
				Dashboard
			</Title>
			<Card withBorder p="xl" radius="md" mb="xl">
				<Group>
					<Avatar
						src={snap.user?.image}
						size={80}
						radius="xl"
						style={{ cursor: "pointer" }}
						onClick={() => navigate({ to: "/profile" })}
					>
						{snap.user?.name?.charAt(0).toUpperCase()}
					</Avatar>
					<div>
						<Text size="lg" fw={500}>
							{snap.user?.name}
						</Text>
						<Text c="dimmed" size="sm">
							{snap.user?.email}
						</Text>
					</div>
				</Group>
			</Card>

			<Title order={2} mb="md">
				Server Status
			</Title>

			<Button
				variant="outline"
				color="red"
				onClick={() => authClient.signOut()}
			>
				Sign Out
			</Button>
		</Container>
	);
}
