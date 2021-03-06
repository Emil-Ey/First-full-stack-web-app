import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const router = useRouter();
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	let body = null;

	// Data is loading
	if (isServer() || fetching) {
		body = null;
		// User not logged in
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href="/login">
					<Link mr={2}>Login</Link>
				</NextLink>
				<NextLink href="/register">
					<Link>Register</Link>
				</NextLink>
			</>
		);
		// User logged in
	} else {
		body = (
			<Flex align="center">
				<NextLink href="/create-post">
					<Button as={Link} mr={4}>
						Create Post
					</Button>
				</NextLink>
				<Box mr={4}>{data?.me.username}</Box>
				<Button
					onClick={async () => {
						await logout();
						router.reload();
					}}
					isLoading={logoutFetching}
					variant="link"
				>
					Log out
				</Button>
			</Flex>
		);
	}

	return (
		<Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
			<Flex margin="auto" flex={1} align="center" maxW="800px">
				<NextLink href="/">
					<Link>
						<Heading>LiReddit</Heading>
					</Link>
				</NextLink>
				<Box ml={"auto"}>{body}</Box>
			</Flex>
		</Flex>
	);
};
