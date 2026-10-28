import {
	Alert,
	Box,
	Button,
	Container,
	Heading,
	Link,
	List,
	Stack,
	Strong,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	GITHUB_REPO_URL,
	githubReleasesUrl,
	MAC_DESKTOP_INSTALLER,
	WINDOWS_DESKTOP_INSTALLER,
} from "@/site-config";
import {
	fetchLatestReleaseAssets,
	type GithubReleaseAsset,
	type MacArch,
	pickMacDmgAsset,
	pickWindowsNsisInstallerAsset,
} from "@/utils/githubReleaseAssets";
import {
	type DesktopOs,
	detectDesktopOs,
	detectMacArch,
} from "@/utils/platform";

export const Route = createFileRoute("/download")({
	component: Download,
	head: () => ({
		meta: [{ title: "Card Anvil · Download" }],
	}),
});

type ReleaseState =
	| { status: "loading" }
	| { status: "ready"; assets: GithubReleaseAsset[] }
	| { status: "error"; message: string };

function Download() {
	const [release, setRelease] = useState<ReleaseState>({ status: "loading" });
	// Prerender runs in Node with no navigator, so the static HTML always shows Windows.
	const [os, setOs] = useState<DesktopOs>(() =>
		typeof navigator === "undefined"
			? "windows"
			: (detectDesktopOs(navigator) ?? "windows"),
	);
	const [macArch, setMacArch] = useState<MacArch | null>(null);

	useEffect(() => {
		const ac = new AbortController();

		(async () => {
			try {
				const assets = await fetchLatestReleaseAssets(GITHUB_REPO_URL, {
					signal: ac.signal,
				});
				if (ac.signal.aborted) return;
				if (!assets) {
					setRelease({
						status: "error",
						message: "Could not load the latest release from GitHub.",
					});
					return;
				}
				setRelease({ status: "ready", assets });
			} catch (e) {
				if (ac.signal.aborted) return;
				const message =
					e instanceof Error ? e.message : "Could not load release info.";
				setRelease({ status: "error", message });
			}
		})();

		return () => ac.abort();
	}, []);

	useEffect(() => {
		let ignore = false;
		detectMacArch(navigator).then((arch) => {
			if (!ignore) setMacArch(arch);
		});
		return () => {
			ignore = true;
		};
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
							Desktop app
						</Heading>
					</Stack>

					<Tabs.Root
						value={os}
						onValueChange={(e) => setOs(e.value as DesktopOs)}
						colorPalette="cyan"
					>
						<Tabs.List>
							<Tabs.Trigger value="windows">Windows</Tabs.Trigger>
							<Tabs.Trigger value="macos">macOS</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="windows" pt={6}>
							<WindowsDownload release={release} />
						</Tabs.Content>
						<Tabs.Content value="macos" pt={6}>
							<MacDownload
								release={release}
								recommendedArch={macArch ?? "aarch64"}
							/>
						</Tabs.Content>
					</Tabs.Root>

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

function WindowsDownload({ release }: { release: ReleaseState }) {
	if (release.status === "loading") {
		return (
			<Button colorPalette="cyan" size="lg" disabled>
				{WINDOWS_DESKTOP_INSTALLER.label} — loading…
			</Button>
		);
	}
	if (release.status === "error") {
		return <ReleasesFallback message={release.message} />;
	}

	const asset = pickWindowsNsisInstallerAsset(
		release.assets,
		WINDOWS_DESKTOP_INSTALLER.githubAssetNamePrefix,
	);
	if (!asset) {
		return (
			<ReleasesFallback message="No Windows installer was found on the latest GitHub release." />
		);
	}
	return (
		<Button key={asset.name} asChild colorPalette="cyan" size="lg">
			<a
				href={asset.browser_download_url}
				target="_blank"
				rel="noreferrer noopener"
			>
				{WINDOWS_DESKTOP_INSTALLER.label}
			</a>
		</Button>
	);
}

function MacDownload({
	release,
	recommendedArch,
}: {
	release: ReleaseState;
	recommendedArch: MacArch;
}) {
	const archs: MacArch[] =
		recommendedArch === "aarch64" ? ["aarch64", "x64"] : ["x64", "aarch64"];

	return (
		<Stack gap={6}>
			<Stack gap={3} align="flex-start">
				<MacDownloadButtons release={release} archs={archs} />
				<Text fontSize="sm" color="fg.muted" m={0}>
					Not sure which Mac you have? Open the Apple menu → About This Mac. A
					“Chip: Apple M…” line means Apple Silicon; “Processor: Intel” means
					Intel.
				</Text>
			</Stack>

			<Alert.Root status="info">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>macOS asks you to approve Card Anvil once</Alert.Title>
					<Alert.Description>
						Card Anvil isn’t notarized by Apple yet, so the first launch is
						blocked until you allow it in System Settings.
					</Alert.Description>
				</Alert.Content>
			</Alert.Root>

			<Stack gap={3}>
				<Heading as="h2" size="lg">
					Installing on macOS
				</Heading>
				<List.Root as="ol" gap={2} ps={5}>
					<List.Item>
						Open the downloaded <Strong>.dmg</Strong> and drag{" "}
						<Strong>Card Anvil</Strong> into the <Strong>Applications</Strong>{" "}
						folder.
					</List.Item>
					<List.Item>
						Open Card Anvil from Applications. macOS warns that it can’t verify
						the app — click <Strong>Done</Strong> (not Move to Trash).
					</List.Item>
					<List.Item>
						Open <Strong>System Settings → Privacy & Security</Strong> and
						scroll to the bottom. Next to “Card Anvil was blocked to protect
						your Mac”, click <Strong>Open Anyway</Strong>.
					</List.Item>
					<List.Item>
						Confirm with <Strong>Open Anyway</Strong> and enter your password.
						From then on, Card Anvil opens normally.
					</List.Item>
				</List.Root>
				<Text fontSize="sm" color="fg.muted" m={0}>
					On macOS 12 and earlier, the setting is under System Preferences →
					Security & Privacy → General.
				</Text>
			</Stack>
		</Stack>
	);
}

function MacDownloadButtons({
	release,
	archs,
}: {
	release: ReleaseState;
	archs: MacArch[];
}) {
	if (release.status === "loading") {
		return (
			<Stack direction={{ base: "column", sm: "row" }} gap={3}>
				{archs.map((arch, i) => (
					<Button
						key={arch}
						colorPalette="cyan"
						size="lg"
						variant={i === 0 ? "solid" : "outline"}
						disabled
					>
						{MAC_DESKTOP_INSTALLER.labels[arch]} — loading…
					</Button>
				))}
			</Stack>
		);
	}
	if (release.status === "error") {
		return <ReleasesFallback message={release.message} />;
	}

	const found = archs.flatMap((arch) => {
		const asset = pickMacDmgAsset(
			release.assets,
			arch,
			MAC_DESKTOP_INSTALLER.githubAssetNamePrefix,
		);
		return asset ? [{ arch, asset }] : [];
	});
	if (found.length === 0) {
		return (
			<ReleasesFallback message="No macOS build was found on the latest GitHub release." />
		);
	}
	return (
		<Stack direction={{ base: "column", sm: "row" }} gap={3}>
			{found.map(({ arch, asset }, i) => (
				<Button
					key={asset.name}
					asChild
					colorPalette="cyan"
					size="lg"
					variant={i === 0 ? "solid" : "outline"}
				>
					<a
						href={asset.browser_download_url}
						target="_blank"
						rel="noreferrer noopener"
					>
						{MAC_DESKTOP_INSTALLER.labels[arch]}
					</a>
				</Button>
			))}
		</Stack>
	);
}

function ReleasesFallback({ message }: { message: string }) {
	return (
		<Stack gap={2} align="flex-start">
			<Text fontSize="sm" color="fg.muted" m={0}>
				{message}
			</Text>
			<Button asChild colorPalette="cyan" size="lg" variant="outline">
				<a href={githubReleasesUrl} target="_blank" rel="noreferrer noopener">
					Browse releases on GitHub
				</a>
			</Button>
		</Stack>
	);
}
