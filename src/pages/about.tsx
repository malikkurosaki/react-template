import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
    component: AboutPage,
});

function AboutPage() {
    return (
        <div className="page-container">
            <h1>About This Project</h1>

            <div className="content-section">
                <h2>🚀 Features</h2>
                <ul className="feature-list">
                    <li>⚡ <strong>Bun Runtime</strong> - Lightning-fast JavaScript runtime</li>
                    <li>⚛️ <strong>React 19</strong> - Latest React with TypeScript</li>
                    <li>🛣️ <strong>File-Based Routing</strong> - Both server and client-side</li>
                    <li>🔥 <strong>Hot Module Reloading</strong> - Instant feedback</li>
                    <li>🎨 <strong>Modern UI</strong> - Beautiful, animated interface</li>
                </ul>
            </div>

            <div className="content-section">
                <h2>📁 Project Structure</h2>
                <pre className="code-block">
                    {`src/
├── pages/          # React pages (file-based routing)
│   ├── __root.tsx  # Root layout
│   ├── index.tsx   # Home page
│   ├── about.tsx   # This page
│   └── users/      # Users section
├── routes/         # API routes (server-side)
│   └── api/        # API endpoints
└── utils/          # Utilities`}
                </pre>
            </div>

            <div className="content-section">
                <h2>🛣️ Routing</h2>
                <p>
                    This project uses <strong>TanStack Router</strong> for client-side routing
                    and a custom file-based routing system for server-side API routes.
                </p>
                <p>
                    Both systems follow the same convention: file structure = URL structure.
                </p>
            </div>

            <div className="content-section">
                <h2>🔗 Links</h2>
                <ul className="link-list">
                    <li><a href="https://bun.sh" target="_blank" rel="noopener noreferrer">Bun Documentation</a></li>
                    <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
                    <li><a href="https://tanstack.com/router" target="_blank" rel="noopener noreferrer">TanStack Router</a></li>
                </ul>
            </div>
        </div>
    );
}
