import {
	Avatar,
	Button,
	Card,
	Code,
	Container,
	Divider,
	Group,
	Modal,
	SimpleGrid,
	Text,
	Title,
} from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { authClient } from "@/utils/auth-client";
import { authStore } from "../store/auth";

export const Route = createFileRoute("/profile")({
	component: Profile,
});

function Profile() {
	const snap = useSnapshot(authStore);
	const navigate = useNavigate();
	const [opened, setOpened] = useState(false);

	async function logout() {
		await authClient.signOut();
		navigate({ to: "/signin" });
	}

	return (
		<Container size="md" py="xl">
			<Title order={1} mb="lg">
				User Profile
			</Title>

			<Card withBorder p="xl" radius="md" mb="xl">
				<Group>
					<Avatar src={snap.user?.image} size={120} radius={120} mx="auto">
						{snap.user?.name?.charAt(0).toUpperCase()}
					</Avatar>
					<div style={{ flex: 1 }}>
						<Text size="xl" fw={500}>
							{snap.user?.name}
						</Text>
						<Text c="dimmed">{snap.user?.email}</Text>
						<Text c="dimmed" size="sm" mt="xs">
							Role: <Code>{snap.user?.role || "user"}</Code>
						</Text>
					</div>
				</Group>
			</Card>

			<Title order={2} mb="md">
				Account Details
			</Title>
			<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
				<Card withBorder p="md" radius="md">
					<Text size="sm" c="dimmed">
						User ID
					</Text>
					<Text fw={500}>{snap.user?.id || "N/A"}</Text>
				</Card>
				<Card withBorder p="md" radius="md">
					<Text size="sm" c="dimmed">
						Email
					</Text>
					<Text fw={500}>{snap.user?.email || "N/A"}</Text>
				</Card>
				<Card withBorder p="md" radius="md">
					<Text size="sm" c="dimmed">
						Name
					</Text>
					<Text fw={500}>{snap.user?.name || "N/A"}</Text>
				</Card>
				<Card withBorder p="md" radius="md">
					<Text size="sm" c="dimmed">
						Role
					</Text>
					<Text fw={500}>
						<Code>{snap.user?.role || "user"}</Code>
					</Text>
				</Card>
			</SimpleGrid>

			<Divider my="md" />

			<Group justify="space-between">
				<Title order={3}>Session</Title>
				<Group>
					{snap.user?.role === "admin" && (
						<Button
							variant="light"
							color="blue"
							onClick={() => navigate({ to: "/dashboard" })}
						>
							Go to Dashboard
						</Button>
					)}
					<Button variant="outline" color="red" onClick={() => setOpened(true)}>
						Sign Out
					</Button>
				</Group>
			</Group>
			<Card withBorder p="md" radius="md" mt="md">
				<Text size="sm" c="dimmed">
					Session Token
				</Text>
				<Code block mt="xs">
					{snap.session?.token?.substring(0, 50)}...
				</Code>
			</Card>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Confirm Sign Out"
				centered
			>
				<Text mb="md">Are you sure you want to sign out?</Text>
				<Group justify="flex-end">
					<Button variant="outline" onClick={() => setOpened(false)}>
						Cancel
					</Button>
					<Button
						color="red"
						onClick={async () => {
							await logout();
							setOpened(false);
						}}
					>
						Sign Out
					</Button>
				</Group>
			</Modal>
		</Container>
	);
}
