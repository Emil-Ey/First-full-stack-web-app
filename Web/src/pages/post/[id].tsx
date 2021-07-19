import React from "react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Heading } from "@chakra-ui/react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = ({}) => {
	const [{ data, fetching }] = useGetPostFromUrl();

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
			{data.post.text}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
