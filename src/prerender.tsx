import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import {
	createMemoryHistory,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import type {
	PrerenderArguments,
	PrerenderResult,
} from "vite-prerender-plugin";
import { Provider } from "@/components/ui/provider";
import { documentTitleFromMatches } from "@/document-title";
import { routeTree } from "./routeTree.gen";

function emotionStyleTagFromCache(
	cache: ReturnType<typeof createCache>,
): string {
	let css = "";
	for (const id of Object.keys(cache.inserted)) {
		const v = cache.inserted[id];
		if (typeof v === "string") {
			css += v;
		}
	}
	if (!css) {
		return "";
	}
	const ids = Object.keys(cache.inserted).join(" ");
	return `<style data-emotion="${cache.key} ${ids}" data-s="">${css}</style>`;
}

function createPrerenderRouter(url: string) {
	return createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: [url] }),
		isServer: true,
		origin: "http://localhost",
		scrollRestoration: false,
		defaultPreload: false,
		defaultPreloadStaleTime: 0,
	});
}

export async function prerender(
	data: PrerenderArguments,
): Promise<PrerenderResult> {
	const cache = createCache({ key: "chakra", prepend: true });
	const router = createPrerenderRouter(data.url);
	// Server render path omits Transitioner (no effects), so matches stay empty until load runs.
	await router.load();

	const markup = renderToString(
		<CacheProvider value={cache}>
			<Provider>
				<RouterProvider router={router} />
			</Provider>
		</CacheProvider>,
	);

	const styles = emotionStyleTagFromCache(cache);
	const html = styles + markup;

	const { parseLinks } = await import("vite-prerender-plugin/parse");
	const discovered = parseLinks(html);

	const title =
		documentTitleFromMatches(router.stores.activeMatchesSnapshot.state) ??
		"Card Anvil";

	return {
		html,
		links: new Set(discovered),
		head: {
			lang: "en",
			title,
		},
	};
}
