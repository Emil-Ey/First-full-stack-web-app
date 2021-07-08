import { Box, Link } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { usePostQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
	const [{ data }] = usePostQuery();
	return (
		<Layout>
			<NextLink href="/create-post">
				<Link>Create Post</Link>
			</NextLink>
			<Box mt={5}>
				{!data ? (
					<div>Loading...</div>
				) : (
					data.posts.map((p) => <div key={p.id}>{p.title}</div>)
				)}
			</Box>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
