/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the RouterProvider to the DOM.
 *
 * It is included in `src/index.html`.
 */
/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation */

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { Inspector } from "react-dev-inspector";
import { createRoot } from "react-dom/client";
import { router } from "./router";

const elem = document.getElementById("root");
if (!elem) {
	throw new Error("Root element not found");
}

// Wrapper component for conditional Inspector
const InspectorWrapper = import.meta.env.DEV
	? Inspector
	: ({ children }: { children: React.ReactNode }) => <>{children}</>;

const app = (
	<StrictMode>
		<InspectorWrapper keys={["shift", "a"]}>
			<MantineProvider defaultColorScheme="dark">
				<RouterProvider router={router} />
			</MantineProvider>
		</InspectorWrapper>
	</StrictMode>
);

if (import.meta.hot) {
	// With hot module reloading, `import.meta.hot.data` is persisted.
	const root = (import.meta.hot.data.root ??= createRoot(elem));
	root.render(app);
} else {
	// The hot module reloading API is not available in production.
	createRoot(elem).render(app);
}
