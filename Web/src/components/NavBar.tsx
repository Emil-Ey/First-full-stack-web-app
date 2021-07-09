import React from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
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
				<NextLink href="/">
					<Link position={"absolute"} left={20}>
						HOME
					</Link>
				</NextLink>
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
			<Flex>
				<NextLink href="/">
					<Link position={"absolute"} left={20}>
						HOME
					</Link>
				</NextLink>
				<Box mr={4}>{data?.me.username}</Box>
				<Button
					mr={20}
					onClick={() => logout()}
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
			<Box ml={"auto"}>{body}</Box>
		</Flex>
	);
};
