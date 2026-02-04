# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Start development environment with auto-reload and route generation
bun dev

# Build for production (outputs to dist/)
bun run build

# Start production server
bun run start

# Generate route tree manually
bun run generate

# Watch for route file changes and regenerate
bun run watch:routes

# Linting and formatting
bun run check   # Check and auto-fix issues
bun run format  # Format code
bun run lint    # Lint only

# Database
bun run seed    # Seed the database
npx prisma migrate dev  # Run migrations
npx prisma generate     # Generate Prisma client

```

## Architecture

### Tech Stack
- **Runtime**: Bun
- **Backend**: Elysia.js server on port 3000
- **Frontend**: React 19 with TanStack Router
- **UI**: Mantine components with PostCSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth (session + API key authentication)
- **Logging**: Pino with pretty printing

### Project Structure

**Server Entry**: `src/index.ts` - Elysia server setup with:
- `/api/*` routes for backend API
- SPA fallback serving `index.html` for all routes

**Frontend Entry**: `src/frontend.tsx` - React app mounted to `#root`

**Routes**: File-based routing in `src/pages/` directory
- Route files generate `src/routeTree.gen.ts` via `@tanstack/router-cli`
- Dynamic routes use `$` prefix (e.g., `users/$id.tsx`)
- Layout routes use `route.tsx` file (e.g., `dashboard/route.tsx`)

**API Routes**: `src/api/` - Elysia route handlers
- Use `apiMiddleware` for authentication (session or API key)
- See `src/api/apikey.ts` for API key CRUD example

**Authentication**: `src/utils/auth.ts` (server) and `src/utils/auth-client.ts` (client)
- Session-based auth via cookies
- API key auth via `X-API-Key` header or `Authorization: Bearer <key>`

**Database**: Prisma schema in `prisma/schema.prisma`
- Client generated to `generated/prisma/`
- Use `src/utils/db.ts` to import Prisma client

**Utilities**:
- `src/utils/logger.ts` - Pino logger instance
- `src/utils/api-client.ts` - Eden client for API calls

### Key Patterns

- **Route files**: Use `createFileRoute` from `@tanstack/react-router`
- **Protected routes**: Wrap with `authMiddleware` in `src/middleware/authMiddleware.tsx`
- **Server auth**: Use `apiMiddleware` which provides `user` in context
- **Environment variables**: Prefix public vars with `BUN_PUBLIC_` for client access

## Route Generation

When creating new pages:
1. Add `.tsx` file to `src/pages/` following TanStack Router conventions
2. Dev server auto-generates route tree on file changes
3. For manual regeneration: `bun run generate`