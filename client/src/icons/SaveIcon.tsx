import React, { HTMLAttributes, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

interface Props extends HTMLAttributes<SVGElement> {
	isActive: boolean;
	postId: number;
}

const SaveIcon: React.FC<Props> = ({ isActive = false, postId, ...rest }) => {
	const [isSaved, setSaved] = useState(isActive);

	const axiosPrivate = useAxiosPrivate();

	const handleSave = async () => {
		setSaved((prev) => !prev);
		try {
			const res = await axiosPrivate.post("/api/posts/saved/", {
				post_id: postId,
			});
			setSaved(res.data.saved);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill={`${isSaved ? "white" : "none"}`}
			viewBox="0 0 24 24"
			strokeWidth={1}
			stroke={isSaved ? "none" : "currentColor"}
			className={`w-7 h-7 cursor-pointer ${
				!isSaved && "hover:stroke-slate-500"
			}`}
			{...rest}
			onClick={() => handleSave()}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
			/>
		</svg>
	);
};

export default SaveIcon;
