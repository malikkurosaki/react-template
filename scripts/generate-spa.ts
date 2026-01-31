import fg from "fast-glob";
import fs from "fs/promises";

const PAGES_DIR = "src/pages";
const DIR = "src/generated";
const OUTPUT = `${DIR}/spa-routes.generated.ts`;

await fs.mkdir(DIR, { recursive: true }).catch(() => {});

// 🔒 dynamic routes harus diabaikan
const isDynamic = (path: string) =>
	path.includes("/$") || /\[[^\]]+\]/.test(path);

export async function generateSpa() {
	const files = await fg(
		[
			// folder-based routes
			`${PAGES_DIR}/**/route.tsx`,
			`${PAGES_DIR}/**/index.tsx`,

			// flat file routes (profile.tsx, about.tsx, dll)
			`${PAGES_DIR}/*.tsx`,
		],
		{
			ignore: [
				"**/__root.tsx",
				"**/$*.tsx",
				"**/[[]*[]].tsx",
			],
		}
	);

	const routes = new Set<string>();

	for (const file of files) {
		let route = file
			.replace(PAGES_DIR, "")
			.replace(/\/route\.tsx$/, "")
			.replace(/\/index\.tsx$/, "")
			.replace(/\.tsx$/, "");

		if (route === "") route = "/";

		route = route.replace(/\\/g, "/");

		if (!isDynamic(route)) {
			routes.add(route);
		}
	}

	const sorted = [...routes].sort();

	const content = `
// ⚠️ AUTO-GENERATED — DO NOT EDIT
export const spaRoutes = ${JSON.stringify(sorted, null, 2)} as const
`;

	await Bun.write(OUTPUT, content);
	console.log("✅ SPA routes generated:", sorted);
}

