import { Box, Heading } from "@chakra-ui/layout";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	CloseButton,
	Link,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../components/InputField";
import { Layout } from "../components/Layout";
import Wrapper from "../components/wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
	const router = useRouter();
	const [, createPost] = useCreatePostMutation();
	const [error, setError] = useState(false);
	useIsAuth();

	return (
		<Layout variant="small">
			<Formik
				initialValues={{ title: "", text: "" }}
				onSubmit={async (values) => {
					const { error } = await createPost({ options: values });
					if (error?.message.includes("logged in")) {
						// Not logged in
						setError(true);
					} else {
						// Login successfully
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Heading mb={5}>Create a post</Heading>
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
							Create Post
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);
