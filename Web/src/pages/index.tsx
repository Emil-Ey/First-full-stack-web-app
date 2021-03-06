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
import NextLink from "next/link";
import React, { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

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
				</Flex>
				<Box mt={5}>
					{!data && fetching ? (
						<div>Loading...</div>
					) : (
						<Stack spacing={8}>
							{data!.posts.posts.map((p) =>
								!p ? null : (
									<Flex
										key={p.id}
										p={5}
										shadow="md"
										borderWidth="1px"
									>
										<UpdootSection post={p} />
										<Box flex={1}>
											<NextLink
												href="post/[id]"
												as={`/post/${p.id}`}
											>
												<Link>
													<Heading fontSize="xl">
														{p.title}
													</Heading>
												</Link>
											</NextLink>
											<Text>
												Posted by {p.creator.username}
											</Text>
											<Text mt={4}>{p.textSnippet}</Text>
											<Flex flex={1} align="center">
												<EditDeletePostButtons
													postId={p.id}
													creatorId={p.creator.id}
												/>
											</Flex>
										</Box>
									</Flex>
								)
							)}
						</Stack>
					)}
					{data && data.posts.hasMore ? (
						<Flex>
							<Button
								onClick={() => {
									setVariables({
										limit: variables.limit,
										cursor: data.posts.posts[
											data.posts.posts.length - 1
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
