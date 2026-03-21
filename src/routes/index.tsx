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

export const Route = createFileRoute("/")({
	component: Home,
	head: () => ({
		meta: [{ title: "Cardanvil · Home" }],
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
						gradientFrom="teal.subtle"
						gradientTo="transparent"
						pointerEvents="none"
						opacity={0.6}
					/>
					<Stack gap={4} position="relative">
						<Text
							fontSize="sm"
							fontWeight="semibold"
							color="teal.fg"
							textTransform="uppercase"
							letterSpacing="wide"
						>
							Chakra UI v3 demo
						</Text>
						<Heading
							as="h1"
							size="4xl"
							fontWeight="bold"
							lineHeight="shorter"
							maxW="3xl"
						>
							Simple pages, one component library.
						</Heading>
						<Text fontSize="lg" color="fg.muted" maxW="2xl">
							This app is a client-only Vite SPA with TanStack Router and Chakra
							UI. Use it as a baseline for product UI without Tailwind or SSR.
						</Text>
						<Stack direction={{ base: "column", sm: "row" }} gap={3}>
							<Button asChild colorPalette="teal">
								<RouterLink to="/about">About</RouterLink>
							</Button>
							<Button asChild variant="outline">
								<a
									href="https://www.chakra-ui.com/docs"
									target="_blank"
									rel="noreferrer"
								>
									Documentation
								</a>
							</Button>
						</Stack>
					</Stack>
				</Box>

				<SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
					{[
						["Routing", "File-based routes with TanStack Router."],
						[
							"Theming",
							"Light, dark, and system via next-themes + Chakra tokens.",
						],
						[
							"Layout",
							"Header, outlet, and footer wrapped in a single Provider.",
						],
						["DX", "Type-safe links and routes across the app."],
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
