import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import SpinnerLoader from "./SpinnerLoader";
import { numberFormatter } from "../utils/utils";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface Props {
	username: string;
}
const PostsByUser: React.FC<Props> = ({ username }) => {
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const [postsByUser, setPostsByUser] = useState<PostType[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchPostsByUser = async () => {
			try {
				const res = await axiosPrivate.get(`/api/posts/user/${username}`, {
					signal: controller.signal,
				});

				if (res.data.posts) {
					isMounted && setPostsByUser((prev) => [...prev, ...res.data.posts]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchPostsByUser();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);
	return isLoading ? (
		<SpinnerLoader />
	) : postsByUser && postsByUser.length > 0 ? (
		<div className="flex justify-center flex-wrap gap-4 max-w-6xl">
			{postsByUser.map((post, idx) => (
				<Link to={`/p/${post.id}`} key={idx}>
					<MiniPost post={post} />
				</Link>
			))}
		</div>
	) : (
		// No Posts
		<div className="font-bold text-gray-300">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="w-10 h-10 inline-block mx-2"
			>
				<path
					fillRule="evenodd"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z"
					clipRule="evenodd"
				/>
			</svg>

			<span>No posts yet</span>
			{auth.user?.username === username && (
				<Link to="/create" className="">
					<span className="hover:text-gray-100">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-10 h-10 inline-block mx-3"
						>
							<path
								fillRule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
								clipRule="evenodd"
							/>
						</svg>
						Create a Post
					</span>
				</Link>
			)}
		</div>
	);
};

export default PostsByUser;

function MiniPost({ post }: { post: PostType }) {
	return (
		<div className="group w-[10em] md:w-[20em] aspect-square overflow-hidden bg-gray-900 relative cursor-pointer">
			<img
				className="w-full h-full object-cover"
				src={post.image}
				alt={post.title}
			/>
			<div className="absolute inset-0 bg-black bg-opacity-60 transition-all hidden group-hover:flex justify-center items-center">
				<div className="font-bold">
					{/* Likes */}
					<div className="text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className={`w-6 h-6 ${post.is_liked && "fill-red-600"}`}
						>
							<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
						</svg>
						<span>{numberFormatter(post.likes_count)}</span>
						{/* Comments */}
					</div>
				</div>
			</div>
		</div>
	);
}
