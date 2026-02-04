import {
	ActionIcon,
	Avatar,
	Badge,
	Button,
	Card,
	Code,
	Container,
	Group,
	Modal,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Tooltip,
} from "@mantine/core";
import {
	IconAt,
	IconCheck,
	IconCopy,
	IconDashboard,
	IconId,
	IconLogout,
	IconShield,
	IconUser,
} from "@tabler/icons-react";
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
	const [copied, setCopied] = useState(false);

	async function logout() {
		await authClient.signOut();
		navigate({ to: "/signin" });
	}

	const copyToClipboard = (text: string) => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="lg" ta="center">
				User Profile
			</Title>

			{/* Profile Header Card */}
			<Card
				withBorder
				p="xl"
				radius="md"
				mb="xl"
				bg="rgba(251, 240, 223, 0.05)"
				style={{ border: "1px solid rgba(251, 240, 223, 0.1)" }}
			>
				<Group justify="center" align="flex-start" gap="xl">
					<Avatar
						src={snap.user?.image}
						size={120}
						radius="xl"
						style={{ border: "2px solid rgba(251, 240, 223, 0.3)" }}
					>
						{snap.user?.name?.charAt(0).toUpperCase()}
					</Avatar>
					<Stack gap="xs" justify="center">
						<Text size="xl" fw={700} c="#fbf0df">
							{snap.user?.name}
						</Text>
						<Group gap="sm">
							<IconAt size={16} stroke={1.5} color="rgba(255, 255, 255, 0.6)" />
							<Text c="dimmed">{snap.user?.email}</Text>
						</Group>
						<Group gap="sm">
							<IconShield
								size={16}
								stroke={1.5}
								color="rgba(255, 255, 255, 0.6)"
							/>
							<Badge
								variant="light"
								color={snap.user?.role === "admin" ? "green" : "blue"}
							>
								{snap.user?.role || "user"}
							</Badge>
						</Group>
					</Stack>
				</Group>
			</Card>

			<Title order={2} mb="md" ta="center">
				Account Information
			</Title>

			<SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
				<Card withBorder p="lg" radius="md" bg="rgba(251, 240, 223, 0.05)">
					<Group>
						<IconId size={24} stroke={1.5} color="#f3d5a3" />
						<div>
							<Text size="sm" c="dimmed">
								User ID
							</Text>
							<Group gap="xs" mt="xs">
								<Text fw={500} truncate="end" miw={0} c="#fbf0df">
									{snap.user?.id || "N/A"}
								</Text>
								<Tooltip
									label={copied ? "Copied!" : "Copy to clipboard"}
									position="top"
								>
									<ActionIcon
										variant="subtle"
										color="gray"
										size="sm"
										onClick={() =>
											snap.user?.id && copyToClipboard(snap.user.id)
										}
									>
										{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
									</ActionIcon>
								</Tooltip>
							</Group>
						</div>
					</Group>
				</Card>
				<Card withBorder p="lg" radius="md" bg="rgba(251, 240, 223, 0.05)">
					<Group>
						<IconAt size={24} stroke={1.5} color="#f3d5a3" />
						<div>
							<Text size="sm" c="dimmed">
								Email
							</Text>
							<Group gap="xs" mt="xs">
								<Text fw={500} truncate="end" miw={0} c="#fbf0df">
									{snap.user?.email || "N/A"}
								</Text>
								<Tooltip
									label={copied ? "Copied!" : "Copy to clipboard"}
									position="top"
								>
									<ActionIcon
										variant="subtle"
										color="gray"
										size="sm"
										onClick={() =>
											snap.user?.email && copyToClipboard(snap.user.email)
										}
									>
										{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
									</ActionIcon>
								</Tooltip>
							</Group>
						</div>
					</Group>
				</Card>
				<Card withBorder p="lg" radius="md" bg="rgba(251, 240, 223, 0.05)">
					<Group>
						<IconUser size={24} stroke={1.5} color="#f3d5a3" />
						<div>
							<Text size="sm" c="dimmed">
								Name
							</Text>
							<Group gap="xs" mt="xs">
								<Text fw={500} truncate="end" miw={0} c="#fbf0df">
									{snap.user?.name || "N/A"}
								</Text>
								<Tooltip
									label={copied ? "Copied!" : "Copy to clipboard"}
									position="top"
								>
									<ActionIcon
										variant="subtle"
										color="gray"
										size="sm"
										onClick={() =>
											snap.user?.name && copyToClipboard(snap.user.name)
										}
									>
										{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
									</ActionIcon>
								</Tooltip>
							</Group>
						</div>
					</Group>
				</Card>
				<Card withBorder p="lg" radius="md" bg="rgba(251, 240, 223, 0.05)">
					<Group>
						<IconShield size={24} stroke={1.5} color="#f3d5a3" />
						<div>
							<Text size="sm" c="dimmed">
								Role
							</Text>
							<Text fw={500} mt="xs" c="#fbf0df">
								{snap.user?.role || "user"}
							</Text>
						</div>
					</Group>
				</Card>
			</SimpleGrid>

			<Card
				withBorder
				p="lg"
				radius="md"
				bg="rgba(251, 240, 223, 0.05)"
				mb="xl"
			>
				<Group justify="space-between" align="center">
					<Title order={3}>Session Information</Title>
					<Group>
						{snap.user?.role === "admin" && (
							<Button
								leftSection={<IconDashboard size={16} />}
								variant="light"
								color="blue"
								onClick={() => navigate({ to: "/dashboard" })}
							>
								Dashboard
							</Button>
						)}
						<Button
							leftSection={<IconLogout size={16} />}
							variant="outline"
							color="red"
							onClick={() => setOpened(true)}
						>
							Sign Out
						</Button>
					</Group>
				</Group>
				<Group mt="md" justify="space-between">
					<div>
						<Text size="sm" c="dimmed" mb="xs">
							Session Token
						</Text>
						<Group gap="xs">
							<Code
								block
								style={{
									fontSize: "0.8rem",
									padding: "0.5rem 0.75rem",
									backgroundColor: "rgba(26, 26, 26, 0.7)",
									color: "#f3d5a3",
								}}
							>
								{snap.session?.token
									? `${snap.session.token.substring(0, 30)}...`
									: "N/A"}
							</Code>
							<Tooltip
								label={copied ? "Copied!" : "Copy to clipboard"}
								position="top"
							>
								<ActionIcon
									variant="light"
									color="gray"
									size="md"
									onClick={() =>
										snap.session?.token && copyToClipboard(snap.session.token)
									}
								>
									{copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
								</ActionIcon>
							</Tooltip>
						</Group>
					</div>
				</Group>
			</Card>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Confirm Sign Out"
				centered
				size="sm"
			>
				<Text mb="md">
					Are you sure you want to sign out? You will need to sign in again to
					access your account.
				</Text>
				<Group justify="flex-end">
					<Button
						variant="subtle"
						color="gray"
						onClick={() => setOpened(false)}
					>
						Cancel
					</Button>
					<Button
						leftSection={<IconLogout size={16} />}
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
