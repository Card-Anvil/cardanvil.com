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
import {
	githubReleasesUrl,
	windowsDownloadsWithUrls,
} from "@/site-config";

export const Route = createFileRoute("/download")({
	component: Download,
	head: () => ({
		meta: [{ title: "Card Anvil · Download" }],
	}),
});

function Download() {
	const downloads = windowsDownloadsWithUrls();

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
						{downloads.map(({ label, fileName, href }) => (
							<Button key={fileName} asChild colorPalette="cyan" size="lg">
								<a href={href} target="_blank" rel="noreferrer noopener">
									{label}
								</a>
							</Button>
						))}
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
