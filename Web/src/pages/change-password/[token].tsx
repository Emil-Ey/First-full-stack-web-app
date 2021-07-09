import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";

export const ChangePassword: NextPage = () => {
	const router = useRouter();
	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState("");
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ newPassword: "", newPassword1: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						token:
							typeof router.query.token === "string"
								? router.query.token
								: "",
						newPassword: values.newPassword,
						newPassword1: values.newPassword1,
					});
					if (response.data?.changePassword.errors) {
						const errorMap = toErrorMap(
							response.data.changePassword.errors
						);
						if ("token" in errorMap) {
							setTokenError(errorMap.token);
						}
						setErrors(errorMap);
					} else if (response.data?.changePassword.user) {
						// worked
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Heading mb={5}>Change Password</Heading>
						<InputField
							name="newPassword"
							placeholder="new password"
							label="New Password"
							type="password"
						/>
						<Box mt={4}>
							<InputField
								name="newPassword1"
								placeholder="new password"
								label="Repeat new Password"
								type="password"
							/>
						</Box>
						{tokenError ? (
							<Flex>
								<Box mr={2} style={{ color: "red" }}>
									{tokenError}
								</Box>
								<NextLink href="/forgot-password">
									<Link>click here to get a new one</Link>
								</NextLink>
							</Flex>
						) : null}
						<Button
							mt={4}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Change Password
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
