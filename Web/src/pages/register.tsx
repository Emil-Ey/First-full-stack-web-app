import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
	const router = useRouter();
	const [, register] = useRegisterMutation();
	return (
		<Layout variant="small">
			<Formik
				initialValues={{ email: "", username: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register({ options: values });
					if (response.data?.register.errors) {
						// Registration error
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register.user) {
						// Registrated successfully
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Heading mb={5}>Register</Heading>
						<InputField
							name="email"
							placeholder="email"
							label="Email"
						/>
						<Box mt={4}>
							<InputField
								name="username"
								placeholder="username"
								label="Username"
							/>
						</Box>
						<Box mt={4}>
							<InputField
								name="password"
								placeholder="password"
								label="Password"
								type="password"
							/>
						</Box>
						<Flex mt={2}>
							<NextLink href="/login">
								<Link ml={"auto"}>Already have a user?</Link>
							</NextLink>
						</Flex>
						<Button
							mt={4}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
