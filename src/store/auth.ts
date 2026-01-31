import { proxy } from "valtio";
import type { authClient } from "../utils/auth-client";

interface AuthState {
	user: (typeof authClient.$Infer.Session.user & { role: string }) | null;
	session: typeof authClient.$Infer.Session.session | null;
}

export const authStore = proxy<AuthState>({
	user: null,
	session: null,
});
