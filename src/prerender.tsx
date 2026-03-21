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
	// Match the default Emotion cache key in the browser so prerendered <style> tags hydrate.
	const cache = createCache({ key: "css", prepend: true });
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

	const html = markup;

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
