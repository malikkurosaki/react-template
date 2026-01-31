import { edenTreaty } from "@elysiajs/eden";
import type { ApiApp } from "../index";

const baseUrl = process.env.BUN_PUBLIC_BASE_URL;

if (!baseUrl) {
	throw new Error("BUN_PUBLIC_BASE_URL is not defined");
}
export const apiClient = edenTreaty<ApiApp>(baseUrl);
