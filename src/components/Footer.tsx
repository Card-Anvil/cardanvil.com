import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { GITHUB_REPO_URL, githubReleasesUrl } from "@/site-config";

export default function Footer() {
	return (
		<Box
			as="footer"
			mt={14}
			borderTopWidth="1px"
			borderColor="border"
			px={4}
      pb={4}
			pt={8}
		>
			<Container maxW="6xl">
				<HStack justify="center" gap={6} wrap="wrap">
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
				<Text
					fontSize="xs"
          color="fg.subtle"
					textAlign="right"
					m={0}
					textTransform="uppercase"
					letterSpacing="wider"
				>
					cardanvil.com
				</Text>
			</Container>
		</Box>
	);
}
