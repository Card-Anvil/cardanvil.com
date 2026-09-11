# Cardanvil (Vite SPA)

Client-only [Vite](https://vitejs.dev/) app with [TanStack Router](https://tanstack.com/router) (file-based routes) and [Chakra UI v3](https://www.chakra-ui.com/) for UI. There is **no** TanStack Start or SSR—production output is static assets under `dist/`.

## Getting started

```bash
npm install
npm run dev
```

Dev server: [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run preview
```

Serve `dist/` with any static host (S3, Netlify, nginx, etc.).

## Prerender (SSG-style HTML, no SSR)

After each production build, [`vite-prerender-plugin`](https://www.npmjs.com/package/vite-prerender-plugin) runs [`src/prerender.tsx`](src/prerender.tsx) in **Node**: it builds a router with `createMemoryHistory`, **`await`s `router.load()`** (required because the server render path does not mount `Transitioner`), then uses **`renderToString`** with the same `Provider` tree as the client. The plugin always starts at **`/`**; further URLs are **discovered** from the prerender HTML via [`parseLinks`](https://github.com/preactjs/vite-prerender-plugin) (same-origin `<a href="…">` with `target` unset or `_self`). Example: the home page links to `/about`, so `/about` is queued automatically—no static route list.

Pages that are **not linked** from anything already prerendered still need `additionalPrerenderRoutes` in [`vite.config.ts`](vite.config.ts) (plugin option).

**Titles** come from each file route’s TanStack **`head()`** (`meta: [{ title: "…" }]`), same as the [document head guide](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management). [`src/document-title.ts`](src/document-title.ts) resolves the active title after `router.load()` for the prerender result and updates `document.title` on the client in [`__root.tsx`](src/routes/__root.tsx).

**TanStack Router:** `@tanstack/router-plugin` uses `autoCodeSplitting: false` so route modules are not lazy-loaded—otherwise `renderToString` can leave an empty shell behind Suspense.

**`@tanstack/router-core/isServer`:** the client export is `false`, which makes `isServer ?? router.isServer` ignore `router.isServer` and keeps Suspense around matches during prerender. Vite aliases that entry to the **development** build (`undefined`), so each router’s `isServer` option applies (browser vs Node).

**Emotion / Chakra:** `@emotion/cache` is aliased to the ESM build that does not touch `document` at import time (Node has no DOM).

No Playwright or headless browser is required for prerender.

## Stack

| Piece        | Role |
| ------------ | ---- |
| `index.html` + `src/main.tsx` | Vite SPA entry, `RouterProvider` |
| `src/routes/` | File-based routes; tree in `src/routeTree.gen.ts` (generated) |
| `src/components/ui/provider.tsx` | `ChakraProvider` + `next-themes` `ThemeProvider` |
| `src/theme.ts` | `createSystem(mergeConfigs(defaultConfig, …))` + `globalCss` for layout resets |
| `vite-prerender-plugin` + `src/prerender.tsx` | Post-build prerender via `renderToString` in Node |

## Routing

Add files under `src/routes/`. Use `Link` from `@tanstack/react-router` for in-app navigation.

Root layout: `src/routes/__root.tsx` wraps the app with `Provider`, `Header`, `<Outlet />`, and `Footer`.

## Styling

UI uses Chakra components and tokens. Theme toggle cycles **light → dark → system** via `next-themes` (`class` on `<html>`).

## Testing

```bash
npm run test
```

## Linting & formatting

[Biome](https://biomejs.dev/):

```bash
npm run lint
npm run format
npm run check
```

## Contributing

### Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<optional scope>): <description>
```

Types are `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, and
`revert`. Breaking changes take a `!` before the colon (`feat(routes)!: …`) or a
`BREAKING CHANGE:` footer. Scope the area you touched — e.g. `routes`, `prerender`, `theme`,
`meta`, `ci`, `deps`:

```
feat(routes): add download page
fix(prerender): include styles in prerendered HTML
chore(deps): bump chakra to 3.36
```

Subjects are imperative, lower case, and take no trailing period. The default branch is `main`
and pull requests target it.

### Coding agents

[AGENTS.md](AGENTS.md) is the single instruction set for Claude Code, Cursor, Codex, and Copilot.
MCP servers are defined once in `.mcp.json` and skills in `.agents/skills/`; `npm run sync:agents`
fans both out to the per-tool locations (`.cursor/`, `.vscode/`, `.codex/`, `.claude/skills/`) and
runs automatically on `npm install`.

## Learn more

- [Chakra UI docs](https://www.chakra-ui.com/docs)
- [TanStack Router](https://tanstack.com/router)
