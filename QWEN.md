# Bun + React Template - Project Context

## Project Overview

This is a modern full-stack web application template combining Bun runtime with React 19 for building scalable applications. The project features dual file-based routing for both server-side API routes and client-side React pages, with automatic route discovery and hot module reloading.

### Key Technologies
- **Runtime**: Bun v1.3.6+ (fast JavaScript runtime and bundler)
- **Frontend**: React 19 with TypeScript
- **Backend**: Elysia.js (Bun-based web framework)
- **Routing**: TanStack Router with automatic route generation
- **UI Framework**: Mantine UI with dark mode support
- **Authentication**: Better Auth with Prisma adapter
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: PostCSS with Mantine preset
- **Code Quality**: Biome (formatter, linter, and more)

## Project Architecture

The application follows a dual routing pattern:
1. **API Routes**: Server-side routes in `src/routes/api/` for backend functionality
2. **Page Routes**: Client-side React pages in `src/pages/` for frontend views

The project uses Elysia.js for the backend API with CORS, Swagger documentation, and custom middleware for authentication. The frontend is built with React 19 and uses TanStack Router for client-side navigation.

## Directory Structure

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
├── middleware/      # API middleware
│   ├── apiMiddleware.tsx
│   └── authMiddleware.tsx
├── generated/       # Auto-generated files
├── store/           # State management
├── router.tsx       # TanStack Router config
├── routeTree.gen.ts # Generated route tree
├── frontend.tsx     # React entry point
├── index.ts         # Server entry point
├── index.html       # HTML template
├── index.css        # Global styles
└── routing.css      # Routing styles
```

## Building and Running

### Development
```bash
# Install dependencies
bun install

# Start development server with hot reload
bun dev
```

The development script (`scripts/dev.ts`) watches for file changes in the `src/pages` directory and automatically regenerates routes when changes occur. It also creates templates for new files.

### Production
```bash
# Build for production
bun build ./src/index.html --outdir=dist --sourcemap --target=browser --minify --define:process.env.NODE_ENV='"production"' --env='BUN_PUBLIC_*'

# Start production server
NODE_ENV=production bun src/index.ts
```

### Other Scripts
```bash
# Generate routes (manually)
bun generate

# Watch routes for changes
bun watch:routes

# Code quality checks
bun check      # Apply fixes
bun format     # Format code
bun lint       # Lint code

# Run Model Context Protocol server
bun mcp
```

## Development Conventions

### File-Based Routing
- **API Routes**: Create files in `src/routes/api/` to automatically create API endpoints
- **Page Routes**: Create files in `src/pages/` to automatically create React pages
- **Dynamic Routes**: Use `$id.tsx` pattern for dynamic route parameters
- **Index Routes**: Use `index.tsx` for root paths (`/`) or folder indices

### Authentication
- Authentication is handled via Better Auth with JWT tokens
- API middleware automatically verifies user sessions
- Protected routes can access user data via the `user` property in request context

### Styling
- Uses Mantine UI components with dark mode support
- Global styles in `index.css`
- Routing-specific styles in `routing.css`
- PostCSS with Mantine preset for consistent styling

### Code Quality
- Uses Biome for formatting, linting, and code analysis
- Follows strict TypeScript settings
- Indentation with tabs and double quotes for strings
- Automatic import organization

## Key Features

1. **Hot Module Replacement**: Changes to React components are instantly reflected without page refresh
2. **Automatic Route Discovery**: New files in designated directories automatically become routes
3. **API Documentation**: Swagger UI available at `/docs`
4. **Authentication**: Built-in user authentication with social login options
5. **Type Safety**: Full TypeScript support with generated route types
6. **Production Optimized**: Minified builds with sourcemaps and environment variable support

## Environment Variables

The application expects several environment variables:
- `BUN_PUBLIC_BASE_URL`: Base URL for the application
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: For GitHub OAuth
- `BETTER_AUTH_SECRET`: Secret for authentication
- `JWT_SECRET`: Secret for JWT verification
- `DATABASE_URL`: PostgreSQL connection string (for Prisma)

## Testing and Validation

While no explicit test files were found in the initial exploration, the project structure supports testing. Unit tests would typically be placed in `__tests__` or `*.test.*` files and could be run with Bun's test runner.

## Deployment

The application is designed to be deployed as a single Bun executable. The production build creates optimized static assets in the `dist` directory, while the server handles API routes and serves the SPA.

## Special Notes

- The route tree (`src/routeTree.gen.ts`) is auto-generated and should not be edited manually
- SPA routes are generated in `src/generated/spa-routes.generated.ts` based on files in `src/pages`
- The development server uses Bun's `--hot` flag for fast refresh capabilities
- Authentication integration with Better Auth provides both email/password and social login options

Sure 🙂 here’s the English version:

---

## Send Notification to User

**Every time a task is completed, you must send a notification to the user and provide a summary of what has been done. Additionally, you must send a notification when you need user input or clarification to proceed with a task.**

This ensures continuous communication with the user and keeps them informed of progress at all times. The agent must always comply with this requirement and send notifications after completing tasks or when user input is needed.

**IMPORTANT: This is a mandatory requirement that must be followed consistently. Failure to send notifications is considered a violation of protocol.**

**ENHANCED COMPLIANCE MEASURES:**
- At the end of each task completion, explicitly state "Task completed: [brief summary of what was done]"
- When requiring user input, explicitly state "Need user input: [specific information needed]"
- If multiple tasks are completed in sequence, provide a summary notification for each major milestone
- Use clear, concise language in all notifications
- Ensure notifications are sent even for partial completions or when encountering errors that require user intervention

Examples:

```bash
bun run scripts/notify_user.ts "Task completed: Updated the routing configuration"
```

```bash
bun run scripts/notify_user.ts "Need user input: Please provide the environment variables for the database connection"
```


