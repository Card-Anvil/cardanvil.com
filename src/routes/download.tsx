import {
	Box,
	Button,
	Container,
	Heading,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	GITHUB_REPO_URL,
	githubReleasesUrl,
	WINDOWS_DESKTOP_INSTALLER,
} from "@/site-config";
import { fetchLatestWindowsNsisInstaller } from "@/utils/githubReleaseAssets";

export const Route = createFileRoute("/download")({
	component: Download,
	head: () => ({
		meta: [{ title: "Card Anvil · Download" }],
	}),
});

function Download() {
	const [state, setState] = useState<
		| { status: "loading" }
		| { status: "ready"; href: string; fileName: string }
		| { status: "error"; message: string }
	>({ status: "loading" });

	useEffect(() => {
		const ac = new AbortController();

		(async () => {
			try {
				const asset = await fetchLatestWindowsNsisInstaller(GITHUB_REPO_URL, {
					namePrefix: WINDOWS_DESKTOP_INSTALLER.githubAssetNamePrefix,
					signal: ac.signal,
				});
				if (ac.signal.aborted) return;
				if (!asset) {
					setState({
						status: "error",
						message:
							"No Windows installer was found on the latest GitHub release.",
					});
					return;
				}
				setState({
					status: "ready",
					href: asset.browser_download_url,
					fileName: asset.name,
				});
			} catch (e) {
				if (ac.signal.aborted) return;
				const message =
					e instanceof Error ? e.message : "Could not load release info.";
				setState({ status: "error", message });
			}
		})();

		return () => ac.abort();
	}, []);

	return (
		<Container maxW="6xl" py={{ base: 8, md: 12 }} px={4}>
			<Box
				p={{ base: 6, md: 8 }}
				rounded="2xl"
				borderWidth="1px"
				borderColor="border"
				bg="bg.subtle"
			>
				<Stack gap={6}>
					<Stack gap={2}>
						<Text
							fontSize="sm"
							fontWeight="semibold"
							color="cyan.fg"
							textTransform="uppercase"
							letterSpacing="wide"
						>
							Download
						</Text>
						<Heading as="h1" size="3xl" fontWeight="bold">
							Windows desktop app
						</Heading>
					</Stack>

					<Stack gap={3} align="flex-start">
						{state.status === "loading" && (
							<Button colorPalette="cyan" size="lg" disabled>
								{WINDOWS_DESKTOP_INSTALLER.label} — loading…
							</Button>
						)}
						{state.status === "ready" && (
							<Button
								key={state.fileName}
								asChild
								colorPalette="cyan"
								size="lg"
							>
								<a href={state.href} target="_blank" rel="noreferrer noopener">
									{WINDOWS_DESKTOP_INSTALLER.label}
								</a>
							</Button>
						)}
						{state.status === "error" && (
							<Stack gap={2} align="flex-start">
								<Text fontSize="sm" color="fg.muted" m={0}>
									{state.message}
								</Text>
								<Button asChild colorPalette="cyan" size="lg" variant="outline">
									<a
										href={githubReleasesUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										Browse releases on GitHub
									</a>
								</Button>
							</Stack>
						)}
					</Stack>

					<Text fontSize="sm" color="fg.muted" m={0}>
						<Link href={githubReleasesUrl} target="_blank" rel="noreferrer">
							All releases & release notes
						</Link>{" "}
						on GitHub — for older builds, checksums, or manual asset browsing.
					</Text>
				</Stack>
			</Box>
		</Container>
	);
}
