import { Heading, Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router, { useRouter } from "next/router";
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
					router.push("/");
					// const { error } = await createPost({ options: values });
					// if (error?.message.includes("logged in")) {
					// 	// Not logged in
					// 	setError(true);
					// } else {
					// 	// Login successfully
					// 	router.push("/");
					// }
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
