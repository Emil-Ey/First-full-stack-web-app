import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
	usePostQuery,
	useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetIntId } from "../../../utils/useGetIntId";

const editPost = ({}) => {
	const router = useRouter();
	const intId = useGetIntId();
	const [{ data, fetching }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	});
	const [, updatePost] = useUpdatePostMutation();

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
		<Layout variant="small">
			<Formik
				initialValues={{ title: data.post.title, text: data.post.text }}
				onSubmit={async (values) => {
					await updatePost({ id: intId, ...values });
					if (typeof router.query.next === "string") {
						router.push(`/post/${router.query.id}`);
					} else {
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Heading mb={5}>Edit the post</Heading>
						<InputField
							name="title"
							placeholder="title"
							label="Title"
						/>
						<Box mt={4}>
							<InputField
								name="text"
								placeholder="text..."
								label="Text"
								textarea={true}
							/>
						</Box>
						<Button
							mt={4}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Edit Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(editPost);
