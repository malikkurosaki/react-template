# bun-react-template

A modern Bun + React template with file-based routing.

## Features

- ⚡ **Bun Runtime** - Fast JavaScript runtime and bundler
- ⚛️ **React 19** - Latest React with TypeScript
- 🛣️ **File-Based Routing** - Automatic API route discovery from `src/routes`
- 🔥 **Hot Module Reloading** - Instant feedback during development
- 🎨 **Modern UI** - Animated interface with API testing component

## Quick Start

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

## File-Based Routing

This project features **dual file-based routing** for both server and client:

### Server-Side (API Routes)

Create API routes by adding files to `src/routes`:

```typescript
// src/routes/api/hello.ts
export async function GET(req: Request) {
  return Response.json({ message: "Hello!" });
}
```

This automatically creates the route `GET /api/hello`.

### Client-Side (React Pages)

Create pages by adding files to `src/pages`:

```typescript
// src/pages/about.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return <h1>About</h1>;
}
```

This automatically creates the route `/about`.

### Routing Convention

| Type | File Path | URL Pattern |
|------|-----------|-------------|
| API | `routes/api/users.ts` | `/api/users` |
| API | `routes/api/users/[id].ts` | `/api/users/:id` |
| Page | `pages/about.tsx` | `/about` |
| Page | `pages/users/index.tsx` | `/users` |
| Page | `pages/users/$id.tsx` | `/users/:id` |

See [src/routes/README.md](src/routes/README.md) for API routing details.

## Project Structure

```
src/
├── pages/           # React pages (client-side routing)
│   ├── __root.tsx   # Root layout with navigation
│   ├── index.tsx    # Home page
│   ├── about.tsx    # About page
│   └── users/
│       ├── index.tsx   # Users list
│       └── $id.tsx     # User detail
├── routes/          # API routes (server-side routing)
│   ├── api/
│   │   ├── hello.ts
│   │   ├── hello/[name].ts
│   │   ├── users.ts
│   │   └── status.ts
│   └── README.md
├── utils/           # Utilities
│   ├── route-scanner.ts
│   └── types.ts
├── router.tsx       # TanStack Router config
├── routeTree.gen.ts # Generated route tree
├── App.tsx          # (Legacy - now using pages/)
├── frontend.tsx     # React entry point
├── index.ts         # Server entry point
├── index.html       # HTML template
├── index.css        # Global styles
└── routing.css      # Routing styles
```

## Available Routes

### API Routes (Server-Side)

The server automatically discovers API routes on startup:

```
📍 Discovered routes:
  /api/hello [GET, PUT]
  /api/hello/:name
  /api/status
  /api/users [GET, POST]
```

### Page Routes (Client-Side)

React pages with TanStack Router:

- `/` - Home page with API tester
- `/about` - Project information
- `/users` - Users list (fetches from API)
- `/users/:id` - User detail page (dynamic route)

## Tech Stack

- **Runtime:** Bun v1.3.6+
- **Framework:** React 19
- **Language:** TypeScript
- **Server:** Bun.serve() with file-based routing
- **Client Router:** TanStack Router v1.157+

---

This project was created using `bun init` in bun v1.3.6. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

