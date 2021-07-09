import React, { useState } from "react";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Heading, Box, Flex, Link, Button, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import NextLink from "next/link";
import { useForgotPasswordMutation } from "../generated/graphql";
import { Layout } from "../components/Layout";

const ForgotPassword: React.FC<{}> = ({}) => {
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<Layout variant="small">
			<Formik
				initialValues={{ email: "" }}
				onSubmit={async (values) => {
					await forgotPassword(values);
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<>
							<Box>
								If an account exists with that email, then you
								should have received an email. If not then
								please try again. \\
							</Box>
							<NextLink href="/login">
								<Link fontWeight="bold" mt={2}>
									Go back
								</Link>
							</NextLink>
						</>
					) : (
						<Form>
							<Heading mb={5}>Get a new Password</Heading>
							<InputField
								name="email"
								placeholder="email"
								label="Email"
							/>
							<Flex mt={2}>
								<Text ml={"auto"}>
									Remembered it?{" "}
									<NextLink href="/login">
										<Link fontWeight="bold">Go back</Link>
									</NextLink>
								</Text>
							</Flex>
							<Button
								mt={4}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Send Link
							</Button>
						</Form>
					)
				}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
