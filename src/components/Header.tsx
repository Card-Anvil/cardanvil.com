import {
	Box,
	Container,
	chakra,
	Flex,
	Heading,
	HStack,
	Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";

const ChakraRouterLink = chakra(RouterLink);

export default function Header() {
	return (
		<Box
			as="header"
			position="sticky"
			top={0}
			zIndex={50}
			borderBottomWidth="1px"
			borderColor="border"
			bg="bg/80"
			backdropFilter="blur(12px)"
		>
			<Container maxW="6xl" py={3}>
				<Flex align="center" justify="space-between" gap={4} wrap="wrap">
					<Heading as="h1" size="md" fontWeight="semibold">
						<ChakraRouterLink
							to="/"
							display="inline-flex"
							alignItems="center"
							gap={2}
							px={3}
							py={2}
							rounded="full"
							borderWidth="1px"
							borderColor="border"
							bg="bg.subtle"
							textDecoration="none"
							color="fg"
							_hover={{ bg: "bg.muted" }}
						>
							<Box h={2} w={2} rounded="full" bg="teal.solid" />
							Cardanvil
						</ChakraRouterLink>
					</Heading>

					<HStack gap={2} flexShrink={0}>
						<ThemeToggle />
					</HStack>

					<HStack
						as="nav"
						gap={4}
						fontSize="sm"
						fontWeight="semibold"
						w={{ base: "full", sm: "auto" }}
						justify={{ base: "center", sm: "flex-start" }}
						order={{ base: 3, sm: 2 }}
					>
						<ChakraRouterLink
							to="/"
							color="fg.muted"
							textDecoration="none"
							_hover={{ color: "fg" }}
							activeProps={{
								style: { color: "var(--chakra-colors-fg)", fontWeight: 700 },
							}}
						>
							Home
						</ChakraRouterLink>
						<ChakraRouterLink
							to="/about"
							color="fg.muted"
							textDecoration="none"
							_hover={{ color: "fg" }}
							activeProps={{
								style: { color: "var(--chakra-colors-fg)", fontWeight: 700 },
							}}
						>
							About
						</ChakraRouterLink>
						<Link
							href="https://chakra-ui.com"
							target="_blank"
							rel="noreferrer"
							color="fg.muted"
							textDecoration="none"
							_hover={{ color: "fg" }}
						>
							Chakra docs
						</Link>
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
