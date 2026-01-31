/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the RouterProvider to the DOM.
 *
 * It is included in `src/index.html`.
 */
/** biome-ignore-all lint/suspicious/noAssignInExpressions: <explanation */

import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

const elem = document.getElementById("root");
if (!elem) {
	throw new Error("Root element not found");
}
const app = (
	<StrictMode>
		<MantineProvider defaultColorScheme="dark">
			<RouterProvider router={router} />
		</MantineProvider>
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
