import path from "node:path";
import { fileURLToPath } from "node:url";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig({
	test: {
		passWithNoTests: true,
	},
	resolve: {
		alias: {
			// Use the Node-aware build: the "browser" entry touches `document` at init and
			// breaks vite-prerender-plugin (runs the bundle in Node without a DOM).
			"@emotion/cache": path.resolve(
				__dirname,
				"node_modules/@emotion/cache/dist/emotion-cache.esm.js",
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
		devtools(),
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
	],
});

export default config;
