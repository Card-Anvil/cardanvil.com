import path from "node:path";
import { fileURLToPath } from "node:url";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig(({ command }) => ({
	resolve: {
		alias: {
			// Use the Node-aware build: the "browser" entry touches `document` at init and
			// breaks vite-prerender-plugin (runs the bundle in Node without a DOM).
			"@emotion/cache": path.resolve(
				__dirname,
				"node_modules/@emotion/cache/dist/emotion-cache.esm.js",
			),
			// Vite's "browser" export uses useInsertionEffect, which does not run during
			// renderToString — so prerendered HTML had class names but no <style> tags (FOUC).
			// The default ESM build uses a sync fallback when document is undefined (Node).
			"@emotion/use-insertion-effect-with-fallbacks": path.resolve(
				__dirname,
				"node_modules/@emotion/use-insertion-effect-with-fallbacks/dist/emotion-use-insertion-effect-with-fallbacks.esm.js",
			),
			// Browser bundle hardcodes isBrowser=true and drops the SSR insertStyles return path.
			"@emotion/utils": path.resolve(
				__dirname,
				"node_modules/@emotion/utils/dist/emotion-utils.esm.js",
			),
			"@emotion/react": path.resolve(
				__dirname,
				"node_modules/@emotion/react/dist/emotion-react.esm.js",
			),
			// Client bundle resolves `isServer` to `false`, which makes `isServer ?? router.isServer`
			// ignore `router.isServer` and keeps Suspense boundaries during prerender (empty HTML).
			// The development build exports `undefined` so runtime uses each router's `isServer`
			// (false in the browser, true in Node prerender). See Matches.tsx in @tanstack/react-router.
			"@tanstack/router-core/isServer": path.resolve(
				__dirname,
				"node_modules/@tanstack/router-core/dist/esm/isServer/development.js",
			),
		},
	},
	plugins: [
		// Devtools starts background resources that can prevent `vite build` from exiting.
		...(command === "serve" ? devtools() : []),
		tanstackRouter({
			target: "react",
			// Eager route modules so vite-prerender-plugin + renderToString resolve
			// route components synchronously (no lazy/Suspense empty shell).
			autoCodeSplitting: false,
		}),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		viteReact({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
		...vitePrerenderPlugin({
			renderTarget: "#root",
			prerenderScript: path.resolve(__dirname, "src/prerender.tsx"),
		}),
		// vite-prerender-plugin dynamic-imports the client graph in Rollup's `generateBundle`.
		// With Rollup's native backend on Node 24, thousands of FILEHANDLEs can stay referenced so
		// the event loop never empties even though the build finished (output is already written).
		{
			name: "exit-after-prerender-build",
			apply: "build",
			enforce: "post",
			closeBundle(this: import("rollup").PluginContext) {
				if (this.meta.watchMode) return;
				setImmediate(() => {
					process.exit(0);
				});
			},
		},
	],
}));

export default config;
