import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { NavBar } from "../components/NavBar";
import { usePostQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
    const [{data}] = usePostQuery();
    return (
        <>    
            <NavBar />
            <div>Hello World!</div>
            <Box mt={5}>
                {!data ? <div>Loading...</div> : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
            </Box>
        </>    
    );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
