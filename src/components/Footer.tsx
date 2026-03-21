import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { GITHUB_REPO_URL, githubReleasesUrl } from "@/site-config";

export default function Footer() {
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
					justify="end"
					gap={4}
					textAlign={{ base: "center", sm: "left" }}
				>
					<Text
						fontSize="xs"
						color="fg.subtle"
						m={0}
						textTransform="uppercase"
						letterSpacing="wider"
					>
						cardanvil.com
					</Text>
				</Flex>
				<HStack justify="center" gap={6} mt={4} wrap="wrap">
					<Link
						href={GITHUB_REPO_URL}
						target="_blank"
						rel="noreferrer"
						fontSize="sm"
						color="fg.muted"
					>
						GitHub
					</Link>
					<Link
						href={githubReleasesUrl}
						target="_blank"
						rel="noreferrer"
						fontSize="sm"
						color="fg.muted"
					>
						Releases
					</Link>
				</HStack>
			</Container>
		</Box>
	);
}
