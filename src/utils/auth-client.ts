import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.BUN_PUBLIC_BASE_URL,
});

export const { useSession, signIn, signOut, signUp, getSession } = authClient;
