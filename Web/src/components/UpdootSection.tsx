import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/react";
import React from "react";
import {
	PostSnippetFragment,
	PostSnippetFragmentDoc,
	useVoteMutation,
} from "../generated/graphql";

interface UpdootProps {
	post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootProps> = ({ post }) => {
	const [, vote] = useVoteMutation();
	return (
		<Flex
			mr={4}
			direction="column"
			justifyContent="center"
			alignItems="center"
		>
			<IconButton
				onClick={async () => {
					if (post.voteStatus === 1) {
						return;
					}
					await vote({
						value: 1,
						postId: post.id,
					});
				}}
				aria-label="updoot post"
				variant="ghost"
				isRound={true}
				icon={<ChevronUpIcon w={6} h={6} />}
				colorScheme={post.voteStatus === 1 ? "green" : undefined}
			/>
			{post.points}
			<IconButton
				onClick={() => {
					if (post.voteStatus === -1) {
						return;
					}
					vote({
						value: -1,
						postId: post.id,
					});
				}}
				aria-label="downdoot post"
				isRound={true}
				variant="ghost"
				icon={<ChevronDownIcon w={6} h={6} />}
				colorScheme={post.voteStatus === -1 ? "red" : undefined}
			/>
		</Flex>
	);
};
