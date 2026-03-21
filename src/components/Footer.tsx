import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<Box
			as="footer"
			mt={16}
			borderTopWidth="1px"
			borderColor="border"
			px={4}
			py={10}
		>
			<Container maxW="6xl">
				<Flex
					direction={{ base: "column", sm: "row" }}
					align="center"
					justify="space-between"
					gap={4}
					textAlign={{ base: "center", sm: "left" }}
				>
					<Text fontSize="sm" color="fg.muted" m={0}>
						&copy; {year} Cardanvil. Demo UI with Chakra UI v3.
					</Text>
					<Text
						fontSize="xs"
						color="fg.subtle"
						m={0}
						textTransform="uppercase"
						letterSpacing="wider"
					>
						Vite SPA · TanStack Router
					</Text>
				</Flex>
				<HStack justify="center" gap={6} mt={4}>
					<Link
						href="https://github.com/chakra-ui/chakra-ui"
						target="_blank"
						rel="noreferrer"
						fontSize="sm"
						color="fg.muted"
					>
						Chakra on GitHub
					</Link>
				</HStack>
			</Container>
		</Box>
	);
}
