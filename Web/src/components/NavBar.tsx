import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery();
    let body = null;
    
    // Data is loading
    if(fetching) {
        body = null;
      // User not logged in
    } else if (!data.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>
            </>
        );
      // User logged in  
    } else {
        body = <Box>{data?.me.username}</Box>;
    }

    return (
        <Flex bg="tomato" p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
}