import {
	createRootRoute,
	Outlet,
	useMatches,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLayoutEffect } from "react";
import { Box } from "@chakra-ui/react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Provider } from "@/components/ui/provider";
import { documentTitleFromMatches } from "@/document-title";
import { SITE_ORIGIN } from "@/site-config";

const DESCRIPTION =
	"Generate high-quality Magic: The Gathering card proxies for paper or screen — with a full custom card editor, multilingual printed text, and offline desktop support.";

export const Route = createRootRoute({
	component: RootLayout,
	head: () => ({
		meta: [
			{ title: "Card Anvil" },
			{ name: "description", content: DESCRIPTION },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "Card Anvil" },
			{ property: "og:title", content: "Card Anvil" },
			{ property: "og:description", content: DESCRIPTION },
			{ property: "og:url", content: SITE_ORIGIN },
			{
				property: "og:image",
				content: `${SITE_ORIGIN}/web-app-manifest-512x512.png`,
			},
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: "Card Anvil" },
			{ name: "twitter:description", content: DESCRIPTION },
			{
				name: "twitter:image",
				content: `${SITE_ORIGIN}/web-app-manifest-512x512.png`,
			},
		],
	}),
});

function RootLayout() {
	const router = useRouter();
	const matches = useMatches();

	useLayoutEffect(() => {
		const t = documentTitleFromMatches(matches);
		if (t) document.title = t;
	}, [matches]);

	return (
		<Provider>
			<Header />
			<Box as="main" flex={1}>
				<Outlet />
			</Box>
			<Footer />
			{typeof window !== "undefined" ? (
				<TanStackRouterDevtools position="bottom-right" router={router} />
			) : null}
		</Provider>
	);
}
