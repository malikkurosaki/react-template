import { edenTreaty } from "@elysiajs/eden";
import type { ApiApp } from "../index";

const baseUrl =
	import.meta.env.BUN_PUBLIC_BASE_URL ||
	(typeof window !== "undefined"
		? window.location.origin
		: "http://localhost:3000");

export const apiClient = edenTreaty<ApiApp>(baseUrl);
