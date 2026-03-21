import {
	createRootRoute,
	Outlet,
	useMatches,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useLayoutEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Provider } from "@/components/ui/provider";
import { documentTitleFromMatches } from "@/document-title";

export const Route = createRootRoute({
	component: RootLayout,
	head: () => ({
		meta: [{ title: "Card Anvil" }],
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
			<Outlet />
			<Footer />
			{typeof window !== "undefined" ? (
				<TanStackRouterDevtools position="bottom-right" router={router} />
			) : null}
		</Provider>
	);
}
