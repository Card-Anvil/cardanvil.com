import {
	Box,
	Button,
	Container,
	Heading,
	SimpleGrid,
	Stack,
	Text,
} from "@chakra-ui/react";
import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { APP_TITLE_FONT_FAMILY, APP_TITLE_FONT_WEIGHT } from "@/app-title-font";
import { WEB_APP_ORIGIN } from "@/site-config";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => ({
		meta: [{ title: "Card Anvil" }],
	}),
});

function Home() {
	return (
		<Container maxW="6xl" py={{ base: 8, md: 12 }} px={4}>
			<Stack gap={8}>
				<Box
					p={{ base: 8, md: 10 }}
					rounded="3xl"
					borderWidth="1px"
					borderColor="border"
					bg="bg.subtle"
					position="relative"
					overflow="hidden"
				>
					<Box
						position="absolute"
						inset={0}
						bgGradient="to-br"
						gradientFrom="cyan.subtle"
						gradientTo="transparent"
						pointerEvents="none"
						opacity={0.65}
					/>
					<Stack gap={4} position="relative">
						<Text
							fontSize="sm"
							fontWeight="semibold"
							color="cyan.fg"
							textTransform="uppercase"
							letterSpacing="wide"
						>
							Forge better proxies
						</Text>
						<Heading
							as="h1"
							size="4xl"
							fontWeight={APP_TITLE_FONT_WEIGHT}
							lineHeight="shorter"
							fontFamily={APP_TITLE_FONT_FAMILY}
						>
							Card Anvil
						</Heading>
						<Text fontSize="xl" color="fg.muted" fontWeight="medium">
							Generate high-quality proxies, for paper or screen, with full
							control for building custom cards.
						</Text>
						<Text fontSize="md" color="fg.muted" m={0}>
							Use the web app in your browser, or grab the Windows desktop build
							for offline card search and rendering.
						</Text>
						<Stack direction={{ base: "column", sm: "row" }} gap={3}>
							<Button asChild colorPalette="cyan" size="lg">
								<a
									href={WEB_APP_ORIGIN}
									target="_blank"
									rel="noreferrer noopener"
								>
									Open web app
								</a>
							</Button>
							<Button asChild variant="outline" size="lg">
								<RouterLink to="/download">Download for Windows</RouterLink>
							</Button>
						</Stack>
					</Stack>
				</Box>

				<SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
					{[
						[
							"Bulk render",
							"Automate your proxy workflow, Photoshop not required.",
						],
						[
							"Frames & fields",
							"Pick a frame, toggle visible fields, and press Forge.",
						],
						[
							"Print-ready",
							"Printing margin included, send direct to your printer.",
						],
						[
							"Web or desktop",
							"Run in the browser at the link above, or install on Windows when you prefer.",
						],
						[
							"Custom cards, built right",
							"Full custom card editor with a raw Scryfall JSON view for total control over every field.",
						],
						[
							"Play in any language",
							"Pick a card's language and Card Anvil finds valid printed text, or leaves blank fields for you to fill in.",
						],
						[
							"Works offline (Desktop only)",
							"A built-in local card database keeps search, printings, and random cards running even without a connection.",
						],
					].map(([title, desc]) => (
						<Box
							key={title}
							p={5}
							rounded="2xl"
							borderWidth="1px"
							borderColor="border"
							bg="bg.subtle"
						>
							<Heading as="h2" size="sm" mb={2}>
								{title}
							</Heading>
							<Text fontSize="sm" color="fg.muted" m={0}>
								{desc}
							</Text>
						</Box>
					))}
				</SimpleGrid>
			</Stack>
		</Container>
	);
}
