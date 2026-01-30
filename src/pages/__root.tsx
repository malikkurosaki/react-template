import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { MantineProvider, AppShell, Group, Burger, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/core/styles.css";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <MantineProvider>
            <AppShell
                header={{ height: 60 }}
                navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                padding="md"
            >
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Text fw={700}>🚀 Bun + React</Text>
                        <Group ml="xl" gap={0} visibleFrom="sm">
                            <UnstyledButton component={Link} to="/" className="nav-link" px="md">Home</UnstyledButton>
                            <UnstyledButton component={Link} to="/about" className="nav-link" px="md">About</UnstyledButton>
                            <UnstyledButton component={Link} to="/users" className="nav-link" px="md">Users</UnstyledButton>
                        </Group>
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar p="md">
                    <UnstyledButton component={Link} to="/" className="nav-link" py="xs" onClick={toggle}>Home</UnstyledButton>
                    <UnstyledButton component={Link} to="/about" className="nav-link" py="xs" onClick={toggle}>About</UnstyledButton>
                    <UnstyledButton component={Link} to="/users" className="nav-link" py="xs" onClick={toggle}>Users</UnstyledButton>
                </AppShell.Navbar>

                <AppShell.Main>
                    <Outlet />
                </AppShell.Main>
            </AppShell>
            {process.env.NODE_ENV !== "production" && <TanStackRouterDevtools />}
        </MantineProvider>
    );
}
