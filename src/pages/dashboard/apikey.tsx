/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
import {
	ActionIcon,
	Alert,
	Button,
	Card,
	Container,
	CopyButton,
	Group,
	LoadingOverlay,
	Modal,
	Switch,
	Table,
	Text,
	TextInput,
	Title,
	Tooltip,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import {
	IconCopy,
	IconEye,
	IconEyeOff,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { protectedRouteMiddleware } from "../../middleware/authMiddleware";
import { apiClient } from "../../utils/api-client";
import dayjs from "dayjs";

export const Route = createFileRoute("/dashboard/apikey")({
	beforeLoad: protectedRouteMiddleware,
	component: DashboardApikeyComponent,
});

interface ApiKey {
	id: string;
	name: string;
	key: string;
	isActive: boolean;
	expiresAt: string | null;
	createdAt: string;
	updatedAt: string;
}

function DashboardApikeyComponent() {
	const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [newKeyName, setNewKeyName] = useState("");
	const [newKeyExpiresAt, setNewKeyExpiresAt] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);
	const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});

	const fetchApiKeys = useCallback(async () => {
		try {
			setLoading(true);
			const response = await apiClient.api.apikey.get();
			if (response.data) {
				setApiKeys((response.data.apiKeys as any) || []);
			}
		} catch (err) {
			setError("Failed to load API keys");
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchApiKeys();
	}, [fetchApiKeys]);

	const handleCreateApiKey = async () => {
		if (!newKeyName.trim()) {
			setError("API key name is required");
			return;
		}

		try {
			setCreating(true);
			const response = await apiClient.api.apikey.post({
				name: newKeyName,
				expiresAt: dayjs(newKeyExpiresAt).toISOString(),
			});

			if (response.data) {
				setApiKeys([...apiKeys, response.data.apiKey as any]);
				setNewKeyName("");
				setNewKeyExpiresAt(null);
				setCreateModalOpen(false);
			}
		} catch (err) {
			setError("Failed to create API key");
			console.error(err);
		} finally {
			setCreating(false);
		}
	};

	const handleToggleApiKey = async (id: string, currentStatus: boolean) => {
		try {
			if (!id) {
				setError("API key ID is required");
				return;
			}
			const response = await apiClient.api.apikey.update.post({
				id,
				isActive: !currentStatus,
			});

			if (response.data) {
				setApiKeys(
					apiKeys.map((key) =>
						key.id === id ? { ...key, isActive: !currentStatus } : key,
					),
				);
			}
		} catch (err) {
			setError("Failed to update API key status");
			console.error(err);
		}
	};

	const handleDeleteApiKey = async (id: string) => {
		try {
			await apiClient.api.apikey.delete.post({
				id,
			});
			setApiKeys(apiKeys.filter((key: ApiKey) => key.id !== id));
		} catch (err) {
			setError("Failed to delete API key");
			console.error(err);
		}
	};


	const toggleShowKey = (id: string) => {
		setShowKey((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	return (
		<Container size="lg" py="xl">
			<Title order={1} mb="lg">
				API Keys Management
			</Title>

			{error && (
				<Alert title="Error" color="red" mb="md">
					{error}
				</Alert>
			)}

			<Card withBorder p="xl" radius="md">
				<Group justify="space-between" mb="md">
					<Title order={3}>Your API Keys</Title>
					<Button
						leftSection={<IconPlus size={16} />}
						onClick={() => setCreateModalOpen(true)}
					>
						Create New API Key
					</Button>
				</Group>

				<Table striped highlightOnHover>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Name</Table.Th>
							<Table.Th>Key</Table.Th>
							<Table.Th>Status</Table.Th>
							<Table.Th>Expiration</Table.Th>
							<Table.Th>Created</Table.Th>
							<Table.Th>Actions</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{apiKeys.map((apiKey) => (
							<Table.Tr key={apiKey.id}>
								<Table.Td>{apiKey.name}</Table.Td>
								<Table.Td>
									<Group gap={4}>
										{showKey[apiKey.id] ? (
											<Text>{apiKey.key}</Text>
										) : (
											<Text c="dimmed">••••••••••••••••••••••••••••••••</Text>
										)}
										<CopyButton value={apiKey.key}>
											{({ copied, copy }) => (
												<Tooltip label={copied ? "Copied" : "Copy"}>
													<ActionIcon
														color={copied ? "green" : "gray"}
														onClick={copy}
													>
														<IconCopy size={16} />
													</ActionIcon>
												</Tooltip>
											)}
										</CopyButton>
										<ActionIcon
											color="gray"
											onClick={() => toggleShowKey(apiKey.id)}
										>
											{showKey[apiKey.id] ? (
												<IconEyeOff size={16} />
											) : (
												<IconEye size={16} />
											)}
										</ActionIcon>
									</Group>
								</Table.Td>
								<Table.Td>
									<Switch
										checked={apiKey.isActive}
										onChange={() =>
											handleToggleApiKey(apiKey.id, apiKey.isActive)
										}
										label={apiKey.isActive ? "Active" : "Inactive"}
									/>
								</Table.Td>
								<Table.Td>
									{apiKey.expiresAt ? formatDate(apiKey.expiresAt) : "Never"}
								</Table.Td>
								<Table.Td>{formatDate(apiKey.createdAt)}</Table.Td>
								<Table.Td>
									<Group>
										<Tooltip label="Delete">
											<ActionIcon
												color="red"
												onClick={() => handleDeleteApiKey(apiKey.id)}
											>
												<IconTrash size={16} />
											</ActionIcon>
										</Tooltip>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>

				{apiKeys.length === 0 && !loading && (
					<Text ta="center" c="dimmed" mt="xl">
						No API keys created yet. Click "Create New API Key" to get started.
					</Text>
				)}
			</Card>

			<Modal
				opened={createModalOpen}
				onClose={() => {
					setCreateModalOpen(false);
					setError(null);
				}}
				title="Create New API Key"
				centered
			>
				<LoadingOverlay
					visible={creating}
					zIndex={1000}
					overlayProps={{ radius: "sm", blur: 2 }}
				/>

				<TextInput
					label="API Key Name"
					placeholder="Enter a name for your API key"
					value={newKeyName}
					onChange={(e) => setNewKeyName(e.currentTarget.value)}
					mb="md"
				/>

				<DatePicker
					value={newKeyExpiresAt ? new Date(newKeyExpiresAt) : undefined}
					onChange={(date: string | null) => setNewKeyExpiresAt(date)}
					mb="md"
				/>

				<Text size="sm" c="dimmed" mb="md">
					This name will help you identify the purpose of this API key.
				</Text>

				<Group justify="flex-end" mt="md">
					<Button
						variant="outline"
						onClick={() => {
							setCreateModalOpen(false);
							setError(null);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleCreateApiKey}>Create API Key</Button>
				</Group>
			</Modal>
		</Container>
	);
}
