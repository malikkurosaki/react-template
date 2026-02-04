import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { inspectorServer } from "@react-dev-inspector/vite-plugin";

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	const env = loadEnv(mode, process.cwd(), "");

	// Explicitly set REACT_EDITOR from environment or default to antigravity
	process.env.REACT_EDITOR = process.env.REACT_EDITOR || 'agy';

	return {
		plugins: [
			react({
				babel: {
					plugins: [
						['@react-dev-inspector/babel-plugin', {}],
					],
				},
			}),
			// Inspector plugin - this handles launch editor endpoint
			inspectorServer(),
		],
		resolve: {
			alias: {
				"@": "/src",
			},
		},
		// Expose BUN_PUBLIC_* env vars to client
		define: {
			"import.meta.env.BUN_PUBLIC_BASE_URL": JSON.stringify(
				env.BUN_PUBLIC_BASE_URL || "http://localhost:3000",
			),
		},
		build: {
			outDir: "dist",
			emptyOutDir: true,
			sourcemap: mode === 'development', // Enable source maps in development
		},
		server: {
			port: 3000,
			strictPort: true,
			proxy: {
				// Proxy all API requests to Bun backend
				"/api": {
					target: "http://localhost:3001",
					changeOrigin: true,
				},
			},
		},
		optimizeDeps: {
			include: ["react", "react-dom", "@mantine/core"],
		},
	};
});
