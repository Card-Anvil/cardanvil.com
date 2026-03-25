import {
	Box,
	Button,
	Container,
	chakra,
	Flex,
	Heading,
	HStack,
	Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "@tanstack/react-router";
import { APP_TITLE_FONT_FAMILY, APP_TITLE_FONT_WEIGHT } from "@/app-title-font";
import { CardAnvilLogoIcon } from "@/components/CardAnvilLogoIcon";
import { WEB_APP_ORIGIN } from "@/site-config";

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
					<Heading as="h1" size="md" fontWeight={APP_TITLE_FONT_WEIGHT}>
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
							<CardAnvilLogoIcon aria-hidden />
							<Box
								as="span"
								fontFamily={APP_TITLE_FONT_FAMILY}
								fontWeight={APP_TITLE_FONT_WEIGHT}
							>
								Card Anvil
							</Box>
						</ChakraRouterLink>
					</Heading>

					<HStack gap={2} flexShrink={0}>
						<Button
							asChild
							colorPalette="cyan"
							size="sm"
							display={{ base: "none", md: "inline-flex" }}
						>
							<a
								href={WEB_APP_ORIGIN}
								target="_blank"
								rel="noreferrer noopener"
							>
								Open app
							</a>
						</Button>
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
							to="/download"
							color="fg.muted"
							textDecoration="none"
							_hover={{ color: "fg" }}
							activeProps={{
								style: { color: "var(--chakra-colors-fg)", fontWeight: 700 },
							}}
						>
							Download
						</ChakraRouterLink>
						<Link
							href={WEB_APP_ORIGIN}
							target="_blank"
							rel="noreferrer noopener"
							color="fg.muted"
							textDecoration="none"
							_hover={{ color: "fg" }}
							display={{ base: "inline", md: "none" }}
						>
							Open app
						</Link>
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
}
