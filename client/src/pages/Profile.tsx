import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FollowButton from "../components/FollowButton";
import { numberFormatter } from "../utils/utils";
import useDocumentTitle from "../hooks/useDocumentTitle";
import SpinnerLoader from "../components/SpinnerLoader";
import PostsByUser from "../components/PostsByUser";
import VerifiedIcon from "../icons/VerifiedIcon";
import SavedPosts from "../components/SavedPosts";
import { PhotonParserRenderer } from "../components/PhotonTextParser";

const GENDER_TYPES: { [key: string]: string } = {
	Male: "He/Him",
	Female: "She/Her",
};

const Profile = () => {
	const { username } = useParams();
	const { auth } = useAuth();
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null!);

	type currentTabType = "POSTS" | "SAVED";
	const [currentTab, setCurrentTab] = useState<currentTabType>("POSTS");

	const isTabActive = (tab: currentTabType) => currentTab === tab;

	const [isLoading, setIsLoading] = useState(true);
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchUserProfile = async () => {
			setIsLoading(true);

			try {
				const res = await axiosPrivate.get(`/api/users/profile/${username}`, {
					signal: controller.signal,
				});

				isMounted && setUserProfile((prev) => ({ ...prev, ...res.data }));
				if (res.data?.user?.username) {
					useDocumentTitle(`@${res.data?.user.username} | Photon`);
				}
			} catch (error: any) {
				if (error?.response?.status === 404) {
					setUserProfile(() => null);
				}
			} finally {
				setIsLoading(false);
			}
		};
		username && fetchUserProfile();
		return () => {
			isMounted = false;
			controller.abort();
			setCurrentTab("POSTS");
		};
	}, [username]);

	return (
		<div className="pt-20  text-white  container mx-auto max-w-4xl">
			{!isLoading ? (
				userProfile ? (
					<div className="flex flex-col items-center gap-3 py-3 px-2 ">
						{/* Header */}
						<header className="flex justify-around items-center gap-10 border-b-[1px] border-gray-700 w-[40em] max-w-full py-5">
							{/*Left  */}
							<div className="p-3">
								{/* Avatar */}
								<AvatarMaker
									avatar={userProfile.profile_image}
									username={userProfile.user?.username}
								/>
							</div>

							{/* Right */}
							<div className="flex-1">
								{/* Username */}
								<header className="flex gap-3 items-center">
									<span className="text-xl ">
										@{userProfile.user?.username}
										{userProfile.is_verified && <VerifiedIcon />}
									</span>

									{(auth.user as User).id === userProfile.user.id ? (
										<Link
											to="/account/edit"
											className=" bg-gray-100 text-black rounded-md p-2  text-sm font-bold hover:bg-gradient-to-r hover:text-white from-purple-600 to-pink-700 cursor-pointer transition-all duration-300"
										>
											Edit Profile
										</Link>
									) : (
										// Following Button
										<FollowButton
											setUserProfile={setUserProfile}
											is_following={userProfile.is_following}
											userId={userProfile.user.id}
										/>
									)}
								</header>

								{/* Statics */}
								<section className="py-6">
									<div className="flex gap-7">
										{/* Posts Count */}
										<span className="text-sm">
											<span className="font-bold text-base mr-1">
												{numberFormatter(userProfile.posts_count)}
											</span>
											{userProfile.posts_count > 0 ? "Post" : "Posts"}
										</span>

										{/* Followers Count */}
										<span className="text-sm cursor-pointer">
											<span className="font-bold text-base mr-1">
												{numberFormatter(userProfile.followers_count)}
											</span>
											{userProfile.followers_count > 0
												? "Followers"
												: "Follower"}
										</span>

										{/* Following Count */}
										<span className="text-sm cursor-pointer">
											<span className="font-bold text-base mr-1">
												{numberFormatter(userProfile.following_count)}
											</span>
											Following
										</span>
									</div>
								</section>

								{/* Username and Bio */}

								<section>
									{userProfile.user.full_name && (
										<span className="font-bold ">
											{userProfile.user.full_name}
										</span>
									)}

									{userProfile.account_type && (
										<span className="block text-xs font-bold tracing-tight text-neutral-500 pt-2 hover:text-neutral-300">
											{userProfile.account_type}
										</span>
									)}

									{userProfile.gender !== "Prefer Not To Say" && (
										<span className="block text-xs font-bold tracing-tight text-neutral-500 pt-2 hover:text-neutral-300">
											{GENDER_TYPES[userProfile.gender]}
										</span>
									)}
									<div className="text-xs py-2 md:hover:text-gray-200 md:hover:text-sm md:text-gray-300 text-gray-200 transition-all">
										<PhotonParserRenderer text={userProfile.bio || ""} />
									</div>
								</section>
							</div>
						</header>

						{/* Tab Switcher */}
						<div className="flex gap-3 my-2">
							<button
								onClick={() => setCurrentTab("POSTS")}
								className={`${
									isTabActive("POSTS") &&
									"bg-gradient-to-r from-purple-700 to to-orange-500"
								} bg-slate-900 text-sm hover:bg-purple-800 font-bold px-7 py-1 rounded-md`}
							>
								Posts
							</button>
							{userProfile.user.id === auth.user?.id && (
								<button
									onClick={() => setCurrentTab("SAVED")}
									className={`${
										isTabActive("SAVED") &&
										"bg-gradient-to-r from-purple-700 to to-orange-500"
									} bg-slate-900 text-sm hover:bg-purple-800 font-bold px-7 py-1 rounded-md`}
								>
									Saved
								</button>
							)}
						</div>

						{/* Posts By User */}
						{userProfile &&
							!isLoading &&
							username &&
							currentTab === "POSTS" && <PostsByUser username={username} />}

						{userProfile &&
							userProfile.user.id === auth.user?.id &&
							currentTab === "SAVED" && <SavedPosts />}
						<footer> &copy;radhaKrsna</footer>
					</div>
				) : (
					<Navigate to={"/404"} />
				)
			) : (
				<SpinnerLoader />
			)}
		</div>
	);
};

export default Profile;

type BioRendererProps = { bio: string[] };
export function BioRenderer({ bio }: BioRendererProps) {
	return (
		<>
			{bio.map((line, idx) => (
				<span key={idx} className="block">
					{line.split(" ").map((word, idx) =>
						word.startsWith("@") ? (
							<Link key={idx} to={`/${word.slice(1)}`}>
								<span className="font-bold text-blue-500">{word + " "}</span>
							</Link>
						) : (
							<span key={idx}>{word + " "}</span>
						)
					)}
				</span>
			))}
		</>
	);
}

function AvatarMaker({
	avatar,
	username,
}: {
	avatar: string | null;
	username: string;
}) {
	return avatar ? (
		<div
			style={{}}
			className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-[2px] border-red-600 "
		>
			<img className="object-cover h-full w-full" src={avatar} alt="" />
		</div>
	) : (
		<div
			className={`w-24 h-24 md:w-32 md:h-32 bg-orange-600 rounded-full text-white font-bold text-xs grid place-items-center select-none border-blue-200 border-[1px]`}
		>
			<span className="text-6xl">{username?.charAt(0).toUpperCase()}</span>
		</div>
	);
}
