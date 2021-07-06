import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import Wrapper from "../components/wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";

interface loginProps {}

export const Login: React.FC<loginProps> = ({}) => {
	const router = useRouter();
	const [, login] = useLoginMutation();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ usernameOrEmail: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login(values);
					if (response.data?.login.errors) {
						// Login error
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						// Login successfully
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Heading mb={5}>Login</Heading>
						<InputField
							name="usernameOrEmail"
							placeholder="username or email"
							label="Username Or Email"
						/>
						<Box mt={4}>
							<InputField
								name="password"
								placeholder="password"
								label="Password"
								type="password"
							/>
						</Box>
						<Flex mt={2}>
							<NextLink href="/forgot-password">
								<Link ml={"auto"}>Forgot Password?</Link>
							</NextLink>
						</Flex>
						<Button
							mt={4}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Login);
