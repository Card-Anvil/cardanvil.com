import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: About,
	head: () => ({
		meta: [{ title: "About · Cardanvil" }],
	}),
});

function About() {
	return (
		<Container maxW="6xl" py={{ base: 8, md: 12 }} px={4}>
			<Box
				p={{ base: 6, md: 8 }}
				rounded="2xl"
				borderWidth="1px"
				borderColor="border"
				bg="bg.subtle"
			>
				<Stack gap={4}>
					<Text
						fontSize="sm"
						fontWeight="semibold"
						color="teal.fg"
						textTransform="uppercase"
						letterSpacing="wide"
					>
						About
					</Text>
					<Heading as="h1" size="3xl" fontWeight="bold">
						A minimal SPA stack.
					</Heading>
					<Text
						fontSize="md"
						color="fg.muted"
						lineHeight="tall"
						maxW="3xl"
						m={0}
					>
						Vite builds the client bundle. TanStack Router handles navigation
						and route code splitting. Chakra UI provides accessible primitives
						and design tokens. There is no TanStack Start or server runtime in
						this template—only static hosting or any static file server for
						production.
					</Text>
				</Stack>
			</Box>
		</Container>
	);
}
