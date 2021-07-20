import React from "react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Heading } from "@chakra-ui/react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { useRouter } from "next/router";

const Post = ({}) => {
	const [{ data, fetching }] = useGetPostFromUrl();
	const router = useRouter();

	if (fetching) {
		return (
			<Layout>
				<div>Loading...</div>
			</Layout>
		);
	}

	if (!data?.post) {
		return (
			<Layout>
				<div>Could not find the post</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<Heading mb={4}>{data.post.title}</Heading>
			<Box mb={4}>{data.post.text}</Box>
			<Box>
				<EditDeletePostButtons
					postId={data.post.id}
					creatorId={data.post.creator.id}
					next={`/post/${data.post.id}`}
				/>
			</Box>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
