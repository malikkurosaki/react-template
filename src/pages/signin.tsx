import {
	Anchor,
	Button,
	Checkbox,
	Container,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "../utils/auth-client";

export const Route = createFileRoute("/signin")({
	component: SigninComponent,
});

function SigninComponent() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const result = await authClient.signIn.email(
				{
					email,
					password,
				},
				{
					onRequest: () => {
						console.log("Sign in request started");
					},
					onSuccess: async () => {
						console.log("Sign in successful, navigating to dashboard");
						navigate({ to: "/profile", replace: true });
					},
					onError: (ctx) => {
						setError(ctx.error.message || "Failed to sign in");
					},
				},
			);

			// If using callbacks, result will be undefined
			if (result?.error) {
				setError(result.error.message || "Failed to sign in");
			}
		} catch {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container size={420} my={40}>
			<Title ta="center" c="dimmed">
				Welcome back!
			</Title>
			<Text c="dimmed" size="sm" ta="center" mt={5}>
				Do not have an account yet?{" "}
				<Anchor
					size="sm"
					component="button"
					onClick={() => navigate({ to: "/signup" })}
				>
					Create account
				</Anchor>
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md">
				<form onSubmit={handleSubmit}>
					<TextInput
						label="Email"
						placeholder="your@email.com"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<PasswordInput
						label="Password"
						placeholder="Your password"
						required
						mt="md"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Checkbox label="Remember me" mt="md" />
					{error && (
						<Text c="red" size="sm" mt="md">
							{error}
						</Text>
					)}
					<Button fullWidth mt="xl" type="submit" loading={loading}>
						Sign in
					</Button>
				</form>

				<Button
					variant="outline"
					fullWidth
					mt="md"
					leftSection={<IconBrandGithub size={18} />}
					onClick={async () => {
						await authClient.signIn.social({
							provider: "github",
							callbackURL: "/profile",
						});
					}}
				>
					Continue with GitHub
				</Button>
			</Paper>
		</Container>
	);
}
