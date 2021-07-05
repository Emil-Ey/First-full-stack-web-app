import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Heading } from '@chakra-ui/react';
import Wrapper from '../components/wrapper';
import InputField from '../components/InputField';
import { useMutation } from 'urql';

interface registerProps {}

const REGISTER_MUT = `
mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }  
`;

export const Register: React.FC<registerProps> = ({}) => {
    const [,register] = useMutation(REGISTER_MUT)
    return ( 
        <Wrapper variant='small'>
            <Formik initialValues={{username: '', password: ''}}
            onSubmit={ async (values) => {
                const response = await register(values);
            }}>
                {({ isSubmitting}) => (
                    <Form>
                        <Heading mb={5}>Register</Heading>
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
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Register;