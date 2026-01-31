import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
});

import {
	ActionIcon,
	AppShell,
	Burger,
	Group,
	NavLink,
	rem,
	ScrollArea,
	Text,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconHome,
	IconKey,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";

function DashboardLayout() {
	const location = useLocation();
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
	const navigate = useNavigate();

	const navItems = [
		{ icon: IconHome, label: "Beranda", to: "/dashboard" },
		{ icon: IconUsers, label: "Pengguna", to: "/dashboard/users" },
		{ icon: IconKey, label: "API Key", to: "/dashboard/apikey" },
		{ icon: IconSettings, label: "Pengaturan", to: "/dashboard/settings" },
	];

	const isActive = (path: string) => {
		const current = location.pathname;

		if (path === "/dashboard") {
			return current === "/dashboard";
		}

		return current === path || current.startsWith(`${path}/`);
	};

	return (
		<AppShell
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
			}}
			padding="md"
			header={{ height: 60 }}
		>
			<AppShell.Header>
				<Group h="100%" px="md" justify="space-between">
					<Group>
						<Burger
							opened={mobileOpened}
							onClick={toggleMobile}
							hiddenFrom="sm"
							size="sm"
						/>
						<Burger
							opened={desktopOpened}
							onClick={toggleDesktop}
							visibleFrom="sm"
							size="sm"
						/>
						<Title order={3}>Dashboard</Title>
					</Group>
					<Group>
						<ActionIcon variant="subtle" size="lg">
							<IconSettings
								style={{ width: rem(20), height: rem(20) }}
								stroke={1.5}
							/>
						</ActionIcon>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<ScrollArea h="calc(100vh - 120px)">
					<Group mb="lg">
						<Text fw={500} size="lg">
							Navigasi Utama
						</Text>
					</Group>
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							onClick={() => {
								navigate({ to: item.to });
							}}
							leftSection={
								<item.icon
									style={{ width: rem(18), height: rem(18) }}
									stroke={1.5}
								/>
							}
							label={item.label}
							active={isActive(item.to)}
						/>
					))}
				</ScrollArea>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
