import { spawn } from "child_process";
import { watch } from "fs";
import { join } from "path";
import { generateSpa } from "./generate-spa";


// Configuration
const PAGES_DIR = join(process.cwd(), "src", "pages");
const EXTENSIONS = [".tsx", ".ts"];

console.log("🚀 Starting Development Environment...");

// 1. Start Bun Dev Server
console.log("🌐 Starting Bun Server...");
const server = spawn("bun", ["--hot", "src/index.ts"], {
	stdio: "inherit",
	shell: true,
});

// 2. Setup Watcher & Generator
console.log("👀 Watching for file changes...");

let isGenerating = false;
let generatePromise: Promise<void> | null = null;

async function runGenerator() {
	if (isGenerating) return;
	isGenerating = true;

	try {
		// console.log("🔄 Updating route tree...");
		const proc = spawn("bun", ["x", "@tanstack/router-cli", "generate"], {
			stdio: ["ignore", "inherit", "inherit"],
		});

		await new Promise<void>((resolve) => {
			proc.on("exit", () => resolve());
		});
		// console.log("✅ Route tree updated");

		generateSpa();
	} catch (err) {
		console.error("❌ Failed to generate routes:", err);
	} finally {
		isGenerating = false;
	}
}

// Debounce generator
function scheduleGenerate() {
	if (generatePromise) return;
	generatePromise = new Promise((resolve) => setTimeout(resolve, 100)).then(
		async () => {
			await runGenerator();
			generatePromise = null;
		},
	);
}

// Initial generation
runGenerator();

try {
	const watcher = watch(
		PAGES_DIR,
		{ recursive: true },
		async (event, filename) => {
			if (!filename) return;

			// Ignore dotfiles
			if (filename.startsWith(".")) return;

			// Check extension
			if (!EXTENSIONS.some((ext) => filename.endsWith(ext))) return;

			const filePath = join(PAGES_DIR, filename);

			try {
				const file = Bun.file(filePath);
				const exists = await file.exists();

				if (exists) {
					const size = await file.size;

					// If empty file, write template
					if (size === 0) {
						console.log(
							`✨ New file detected: ${filename}. Generating template...`,
						);
						await writeTemplate(filePath, filename);
						// Generator will be triggered by the write
					}
				}

				// Schedule generation on any change (creation, modification, deletion)
				scheduleGenerate();
			} catch (err) {
				// File access error, ignore
			}
		},
	);

	watcher.on("error", (err) => {
		console.error("Watcher error:", err);
	});
} catch (err) {
	console.error("Failed to start watcher:", err);
}

// Helper to write component template
async function writeTemplate(filePath: string, relativePath: string) {
	// Convert file path to route path for createFileRoute
	let routePath = relativePath.replace(/\.(tsx|ts)$/, "");

	// Handle index files
	if (routePath === "index" || routePath.endsWith("/index")) {
		routePath = routePath.replace(/\/index$/, "/");
		if (routePath === "index") routePath = "/";
	}

	// Ensure starts with /
	if (!routePath.startsWith("/")) {
		routePath = "/" + routePath;
	}

	// Component Name (simple heuristic)
	const componentName = toPascalCase(routePath) + "Component";

	const template = `import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('${routePath}')({
  component: ${componentName},
})

function ${componentName}() {
  return (
    <div>
      Hello from ${routePath}!
    </div>
  )
}
`;

	await Bun.write(filePath, template);
	console.log(`✅ Template written to ${relativePath}`);
}

function toPascalCase(str: string): string {
	return (
		str
			.split("/")
			.filter(Boolean)
			.map((part) =>
				part
					.replace(/[^a-zA-Z0-9]/g, "") // Remove special chars like $
					.replace(/^\w/, (c) => c.toUpperCase()),
			)
			.join("") || "Index"
	);
}

// Handle cleanup
process.on("SIGINT", () => {
	console.log("\n🛑 Shutting down...");
	server.kill();
	process.exit();
});
