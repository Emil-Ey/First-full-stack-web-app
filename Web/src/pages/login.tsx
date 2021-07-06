import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Heading } from '@chakra-ui/react';
import Wrapper from '../components/wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface loginProps {}

export const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return ( 
        <Wrapper variant='small'>
            <Formik 
                initialValues={{username: "", password: ""}}
                onSubmit={ async (values, { setErrors }) => {
                    const response = await login({ options: values });
                    if (response.data?.login.errors) {
                        // Login error
                        setErrors(toErrorMap(response.data.login.errors));
                    } else {
                        // Login successfully
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting}) => (
                    <Form>
                        <Heading mb={5}>Login</Heading>
                        <InputField 
                            name="username" 
                            placeholder="username" 
                            label="Username"
                        />
                        <Box mt={4}>
                            <InputField 
                                name="password" 
                                placeholder="password" 
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Login;