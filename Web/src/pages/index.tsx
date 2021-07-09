import {
	Box,
	Button,
	Flex,
	Heading,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables,
	});

	if (!data && !fetching) {
		return (
			<Box
				pb={10}
				mt="300"
				textAlign="center"
				mx="auto"
				maxW={"400px"}
				w="100%"
			>
				<Text fontSize="30">Something went wrong.</Text>
				<br />
				<Text fontSize="20">Please try again later.</Text>
			</Box>
		);
	} else {
		return (
			<Layout>
				<Flex align={"center"}>
					<Heading>Latest Posts</Heading>
					<NextLink href="/create-post">
						<Link ml={"auto"}>Create Post</Link>
					</NextLink>
				</Flex>
				<Box mt={5}>
					{!data && fetching ? (
						<div>Loading...</div>
					) : (
						<Stack spacing={8}>
							{data!.posts.map((p) => (
								<Box
									key={p.id}
									p={5}
									shadow="md"
									borderWidth="1px"
								>
									<Heading fontSize="xl">{p.title}</Heading>
									<Text mt={4}>{p.textSnippet}</Text>
								</Box>
							))}
						</Stack>
					)}
					{data ? (
						<Flex>
							<Button
								onClick={() => {
									setVariables({
										limit: variables.limit,
										cursor: data.posts[
											data.posts.length - 1
										].createdAt,
									});
								}}
								isLoading={fetching}
								m={"auto"}
								mt={10}
							>
								Load more
							</Button>
						</Flex>
					) : null}
				</Box>
			</Layout>
		);
	}
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
