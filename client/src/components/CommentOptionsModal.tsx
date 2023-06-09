import React, { useState } from "react";
import { useModal } from "../context/ModalProvider";
import CpuChip from "../icons/CpuChip";
import useAuth from "../hooks/useAuth";
import Pin from "../icons/Pin";
import Report from "../icons/Report";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
	CommentActionTypes,
	CommentActions,
} from "../reducers/CommentsReducer";
import { useApp } from "../context/AppProvider";
import { DeleteButton } from "./PostOptionsModal";

interface Props {
	comment: CommentType;
	commentDispatch: React.Dispatch<CommentActions>;
}
const CommentOptionsModal: React.FC<Props> = ({ comment, commentDispatch }) => {
	const { hideModal } = useModal();
	const { auth } = useAuth();
	// const { appDispatch } = useApp();

	const axiosPrivate = useAxiosPrivate();
	const stopPropagation = (event: React.MouseEvent) => {
		event.stopPropagation();
	};

	const handlePinComment = async () => {
		if (comment.pinned) {
			commentDispatch({
				type: CommentActionTypes.UNPIN_COMMENT,
				payload: { commentId: comment.id },
			});
		} else {
			commentDispatch({
				type: CommentActionTypes.PIN_COMMENT,
				payload: { commentId: comment.id },
			});
		}

		hideModal();
		await axiosPrivate.put(`/api/comments/${comment.id}`, {
			pinned: !comment.pinned,
		});
	};

	// Todo make a tost when comment is deleted or show error if it is not deleted

	const handleDeleteComment = async () => {
		try {
			commentDispatch({
				type: CommentActionTypes.DELETE_COMMENT,
				payload: {
					commentId: comment.id,
					isReply: comment.parent !== null,
					parentId: comment.top_level_parent_id,
				},
			});
			hideModal();
			await axiosPrivate.delete(`/api/comments/${comment.id}`);
		} catch (err) {
			// Do Error Handling
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-70 text-white  flex justify-center items-center "
			onClick={() => hideModal()}
		>
			<div
				className="w-[20em] bg-neutral-900 rounded-md overflow-hidden"
				onClick={(e) => stopPropagation(e)}
			>
				{(auth.user?.id === comment.post_user_id ||
					comment.user_id === auth.user?.id) && (
					<>
						<DeleteButton onConfirm={handleDeleteComment} />
					</>
				)}

				{/* Pin comments */}
				{comment.parent === null && auth.user?.id === comment.post_user_id && (
					<button
						onClick={() => handlePinComment()}
						className="flex justify-center items-center text-gray-300 gap-2 w-full py-3 px-2 font-bold hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700"
					>
						<Pin className="stroke-gray-500" />
						<span>{comment.pinned ? "Unpin Comment" : "Pin Comment"}</span>
					</button>
				)}

				{comment.user_id !== auth.user?.id && (
					<button className="flex justify-center items-center  gap-2 w-full py-3 px-2 text-red-500 font-bold hover:bg-neutral-800 transition-colors border-b-[1px] border-b-gray-700">
						<Report />
						Report
					</button>
				)}

				{auth.user?.is_superuser && (
					<button className="flex justify-center items-center gap-2 w-full py-3 px-2 font-bold text-purple-500 hover:bg-neutral-800 transition-colors ">
						<CpuChip />
						Disable Comment
					</button>
				)}
			</div>
		</div>
	);
};

export default CommentOptionsModal;
