import { Heading, Box } from "@chakra-ui/layout";
import { Button, Textarea } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost: React.FC<{}> = ({}) => {
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ title: "", text: "" }}
				onSubmit={async (values, { setErrors }) => {
					console.log(values);
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
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(CreatePost);
