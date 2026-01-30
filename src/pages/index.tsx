import { createFileRoute } from "@tanstack/react-router";
import { Container, Title, Text, Group, Image, Stack, Code } from "@mantine/core";
import logo from "../logo.svg";
import reactLogo from "../react.svg";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <Container size="md" py="xl">
            <Stack align="center" gap="xl">
                <Group gap="xl">
                    <Image src={logo} w={120} alt="Bun Logo" />
                    <Image src={reactLogo} w={120} alt="React Logo" className="logo react-logo" />
                </Group>

                <Title order={1}>Bun + React</Title>

                <Text size="lg" ta="center">
                    Edit <Code>src/pages/index.tsx</Code> and save to test HMR
                </Text>

                <Text c="dimmed" size="sm">
                    ✨ Now with <strong>file-based routing</strong> powered by TanStack Router & <strong>Mantine UI</strong>!
                </Text>
            </Stack>
        </Container>
    );
}
