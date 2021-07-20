import { Box, IconButton, Link } from "@chakra-ui/react";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { isServer } from "../utils/isServer";

interface EditDeletePostButtonsProps {
	postId: number;
	creatorId: number;
	next?: string;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
	postId,
	creatorId,
	next,
}) => {
	const [{ data: meData }] = useMeQuery({
		pause: isServer(),
	});
	const [, deletePost] = useDeletePostMutation();

	if (creatorId !== meData?.me?.id) {
		return null;
	}

	if (!next) {
		return (
			<Box ml="auto">
				<NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
					<IconButton
						as={Link}
						mr={4}
						aria-label="edit post"
						variant="ghost"
						icon={<EditIcon w={6} h={6} />}
					/>
				</NextLink>
				<IconButton
					aria-label="delete post"
					variant="ghost"
					icon={<DeleteIcon w={6} h={6} />}
					onClick={async () => {
						deletePost({
							id: postId,
						});
					}}
				/>
			</Box>
		);
	}

	return (
		<Box ml="auto">
			<NextLink
				href="/post/edit/[id]?next=[next]"
				as={`/post/edit/${postId}?next=${next}`}
			>
				<IconButton
					as={Link}
					mr={4}
					aria-label="edit post"
					variant="ghost"
					icon={<EditIcon w={6} h={6} />}
				/>
			</NextLink>
			<IconButton
				aria-label="delete post"
				variant="ghost"
				icon={<DeleteIcon w={6} h={6} />}
				onClick={async () => {
					deletePost({
						id: postId,
					});
				}}
			/>
		</Box>
	);
};
