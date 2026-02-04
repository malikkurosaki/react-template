import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	Container,
	Grid,
	Group,
	Modal,
	Progress,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import {
	IconClock,
	IconDatabase,
	IconServer,
	IconUserCheck,
} from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { authClient } from "@/utils/auth-client";
import { authStore } from "../../store/auth";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardComponent,
});

function DashboardComponent() {
	const snap = useSnapshot(authStore);
	const navigate = useNavigate();
	const [logoutModalOpen, setLogoutModalOpen] = useState(false);

	// Mock data for dashboard stats
	const statsData = [
		{ title: "Total Users", value: "1,234", icon: <IconUserCheck size={24} /> },
		{ title: "Server Uptime", value: "99.9%", icon: <IconClock size={24} /> },
		{ title: "Database Load", value: "42%", icon: <IconDatabase size={24} /> },
		{ title: "Active Sessions", value: "128", icon: <IconServer size={24} /> },
	];

	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="lg" ta="center">
				Dashboard Overview
			</Title>

			{/* User Profile Card */}
			<Card
				withBorder
				p="xl"
				radius="md"
				mb="xl"
				bg="rgba(251, 240, 223, 0.05)"
				style={{ border: "1px solid rgba(251, 240, 223, 0.1)" }}
			>
				<Group justify="space-between">
					<Group>
						<Avatar
							src={snap.user?.image}
							size={80}
							radius="xl"
							style={{
								cursor: "pointer",
								border: "2px solid rgba(251, 240, 223, 0.3)",
							}}
							onClick={() => navigate({ to: "/profile" })}
						>
							{snap.user?.name?.charAt(0).toUpperCase()}
						</Avatar>
						<div>
							<Text size="lg" fw={600} c="#fbf0df">
								{snap.user?.name}
							</Text>
							<Text c="dimmed" size="sm">
								{snap.user?.email}
							</Text>
							<Badge mt="xs" variant="light" color="green">
								Verified Account
							</Badge>
						</div>
					</Group>
					<Button
						variant="outline"
						color="red"
						onClick={() => setLogoutModalOpen(true)}
					>
						Sign Out
					</Button>
				</Group>
			</Card>

			{/* Stats Grid */}
			<SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
				{statsData.map((stat, index) => (
					<Card
						key={index.toString()}
						withBorder
						p="lg"
						radius="md"
						bg="rgba(251, 240, 223, 0.05)"
					>
						<Group justify="space-between">
							<Box>
								<Text size="sm" c="dimmed">
									{stat.title}
								</Text>
								<Text size="lg" fw={700} c="#fbf0df">
									{stat.value}
								</Text>
							</Box>
							<Box c="#f3d5a3">{stat.icon}</Box>
						</Group>
					</Card>
				))}
			</SimpleGrid>

			<Grid gutter="lg">
				<Grid.Col span={{ base: 12, md: 8 }}>
					<Card
						withBorder
						p="lg"
						radius="md"
						mb="lg"
						bg="rgba(251, 240, 223, 0.05)"
					>
						<Title order={3} mb="md">
							System Performance
						</Title>
						<Stack gap="md">
							<Box>
								<Group justify="space-between" mb="xs">
									<Text size="sm">CPU Usage</Text>
									<Text size="sm" fw={500}>
										32%
									</Text>
								</Group>
								<Progress value={32} color="green" />
							</Box>
							<Box>
								<Group justify="space-between" mb="xs">
									<Text size="sm">Memory Usage</Text>
									<Text size="sm" fw={500}>
										64%
									</Text>
								</Group>
								<Progress value={64} color="blue" />
							</Box>
							<Box>
								<Group justify="space-between" mb="xs">
									<Text size="sm">Disk Usage</Text>
									<Text size="sm" fw={500}>
										45%
									</Text>
								</Group>
								<Progress value={45} color="yellow" />
							</Box>
						</Stack>
					</Card>
				</Grid.Col>

				<Grid.Col span={{ base: 12, md: 4 }}>
					<Card withBorder p="lg" radius="md" bg="rgba(251, 240, 223, 0.05)">
						<Title order={3} mb="md">
							Server Status
						</Title>
						<Stack gap="sm">
							<Group justify="space-between">
								<Text size="sm">Main Server</Text>
								<Badge color="green" variant="light">
									Online
								</Badge>
							</Group>
							<Group justify="space-between">
								<Text size="sm">Database</Text>
								<Badge color="green" variant="light">
									Connected
								</Badge>
							</Group>
							<Group justify="space-between">
								<Text size="sm">Cache</Text>
								<Badge color="green" variant="light">
									Running
								</Badge>
							</Group>
							<Group justify="space-between">
								<Text size="sm">Backup</Text>
								<Badge color="orange" variant="light">
									Pending
								</Badge>
							</Group>
						</Stack>
					</Card>
				</Grid.Col>
			</Grid>
			<Modal
				opened={logoutModalOpen}
				onClose={() => setLogoutModalOpen(false)}
				title="Confirm Logout"
				centered
			>
				<Text mb="md">Are you sure you want to log out?</Text>
				<Group justify="flex-end">
					<Button variant="outline" onClick={() => setLogoutModalOpen(false)}>
						Cancel
					</Button>
					<Button
						color="red"
						onClick={() => {
							authClient.signOut();
							setLogoutModalOpen(false);
						}}
					>
						Logout
					</Button>
				</Group>
			</Modal>
		</Container>
	);
}
