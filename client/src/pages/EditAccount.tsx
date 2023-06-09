import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useDocumentTitle from "../hooks/useDocumentTitle";
import SpinnerLoader from "../components/SpinnerLoader";
import EditProfileImageRound from "../components/ProfileEditor/EditProfileImageRound";
import VerifiedIcon from "../icons/VerifiedIcon";
import { ModalType, useModal } from "../context/ModalProvider";
import { CheckIcon } from "@heroicons/react/24/outline";

interface EditStatus {
	isUpdating: boolean;
	isUpdated: boolean;

	info: {
		error: boolean;
		msg: string;
	};
	edited: boolean;
}

const ACCOUNT_TYPE_CHOICES = [
	"Artist",
	"Entrepreneur",
	"Doctor",
	"Engineer",
	"Influencer",
	"Designer",
	"Photographer",
	"Writer",
	"Musician",
	"Chef",
	"Athlete",
	"Teacher",
	"Scientist",
	"Lawyer",
	"Student",
	"Investor",
	"Freelancer",
	"Journalist",
	"Consultant",
	"Traveler",
] as const;

type AccountType = (typeof ACCOUNT_TYPE_CHOICES)[number];
export interface AccountState {
	bio: string;
	gender: Gender;
	accountType: AccountType | null;
	first_name: string;
	last_name: string;
}

const EditAccount = () => {
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();
	const { showModal } = useModal();
	const [editStatus, setEditStatus] = useState<EditStatus>({
		isUpdated: false,
		isUpdating: false,
		info: { error: false, msg: "" },
		edited: false,
	});

	const [isUserProfileDataLoading, setIsUserProfileDataLoading] =
		useState(true);
	//
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [bioLetterCount, setBioLetterCount] = useState(0);

	const [accountState, setAccountState] = useState<AccountState>({
		bio: "",
		gender: "Prefer Not To Say",
		accountType: null,
		first_name: "",
		last_name: "",
	});

	const handleOnChange = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		e.persist();
		setAccountState((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};

	const handleUpdateUserProfile = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = {
			...(userProfile?.bio !== accountState.bio && {
				bio: accountState.bio.slice(0, 125),
			}),
			...(userProfile?.gender !== accountState.gender && {
				gender: accountState.gender,
			}),
			...(userProfile?.account_type !== accountState.accountType && {
				account_type: accountState.accountType,
			}),
		};

		try {
			setEditStatus((prev) => ({
				...prev,
				edited: true,
				isUpdating: true,
				isUpdated: false,
			}));

			const res = await axiosPrivate.put(
				`/api/users/profile/${auth.user?.username}`,
				data
			);
			setUserProfile(res.data);
			setEditStatus((prev) => ({
				...prev,
				edited: true,
				isUpdating: false,
				isUpdated: true,
			}));
		} catch (error) {
			console.log(error);
		} finally {
			setEditStatus((prev) => ({
				...prev,
				edited: true,
				isUpdating: false,
				isUpdated: true,
			}));
		}
	};

	useEffect(() => {
		setEditStatus((prev) => ({
			...prev,
			edited: true,
			isUpdating: false,
			isUpdated: false,
		}));
		setBioLetterCount(() => accountState.bio.length);
	}, [accountState]);

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchUserProfile = async () => {
			setIsUserProfileDataLoading(true);

			try {
				const res = await axiosPrivate.get(
					`/api/users/profile/${auth.user?.username}`,
					{
						signal: controller.signal,
					}
				);
				console.log(res.data);
				if (isMounted) {
					setUserProfile((prev) => ({ ...prev, ...res.data }));
					setAccountState((prev) => ({
						...prev,
						bio: res.data.bio || "",
						gender: res.data.gender || "",
						accountType: res.data.account_type,
						first_name: res.data.user.first_name,
						last_name: res.data.user.last_name,
					}));
				}

				if (res.data?.user?.username) {
					useDocumentTitle(`Edit -> @${res.data?.user.username} | Photon`);
				}
			} catch (error: any) {
				if (error?.response?.status === 404) {
					setUserProfile(() => null);
				}
			} finally {
				setIsUserProfileDataLoading(false);
			}
		};
		fetchUserProfile();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<div className="py-20 text-white mx-auto max-w-3xl">
			{isUserProfileDataLoading ? (
				<SpinnerLoader />
			) : (
				<div className="md:border-[1px] border-neutral-700 rounded-sm px-5 py-3">
					<header className="flex w-full gap-10 py-3">
						<EditProfileImageRound
							onClick={() =>
								showModal({
									type: ModalType.PROFILE_IMAGE_EDITOR,
									userProfileDispatch: setUserProfile,
								})
							}
							src={userProfile?.profile_image ?? ""}
							alt={userProfile?.user.username}
						/>
						<div className="flex-1 flex items-center">
							<span className="text-xl font-bol">
								@{userProfile?.user.username}
							</span>
							{userProfile?.is_verified && <VerifiedIcon />}
						</div>
					</header>

					<div
						className={`flex items-center border-[1px] border-purple-500 rounded-full py-1 px-3 max-w-fit mb-3 opacity-0 ${
							editStatus.isUpdated && "opacity-100"
						} transition-opacity duration-200`}
					>
						<CheckIcon
							strokeWidth={3}
							className="inline-block text-gray-200 w-5 mr-2"
						/>{" "}
						<span className="fon text-gray-200">Updated</span>
					</div>

					<section>
						<form
							onSubmit={handleUpdateUserProfile}
							className="grid gap-3 md:grid-cols-2 text-gray-200"
						>
							{/* Bio */}
							<div className="flex flex-col justify-start md:col-span-2 max-h-[30ch] gap-2 ">
								<label
									className="font-bold capitalize text-gray-200"
									htmlFor="bio"
								>
									Bio
								</label>

								<textarea
									onChange={handleOnChange}
									className="p-2 bg-transparent border-[1px] border-neutral-700 rounded"
									name="bio"
									id="bio"
									value={accountState.bio}
								></textarea>

								<div className="font-bold text-xs bg-zinc-800 text-green-300 w-max py-1 px-3 rounded-full">
									<span
										className={`${bioLetterCount >= 125 && "text-red-500"}`}
									>
										{bioLetterCount}
									</span>
									<span> / 125</span>
								</div>
							</div>

							{/* Gender */}
							<div className="flex flex-col  justify-start mb-5 gap-3">
								<label
									className="font-bold capitalize text-gray-200"
									htmlFor="gender"
								>
									First Name
								</label>
								<input
									type="text"
									readOnly
									// onChange={handleOnChange}
									className="hover:text-gray-200 hover:border-gray-200  p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1"
									placeholder="First Name"
									name=""
									id="first_name"
									value={accountState.first_name}
								></input>
							</div>

							<div className="flex flex-col  justify-start mb-5 gap-3">
								<label
									className="font-bold capitalize text-gray-200"
									htmlFor="gender"
								>
									Last Name
								</label>
								<input
									readOnly
									// onChange={handleOnChange}
									type="text"
									className="hover:text-gray-200 hover:border-gray-200  p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1"
									name="last_name"
									placeholder="Last Name"
									id="last_name"
									value={accountState.last_name}
								></input>
							</div>
							{/* End */}

							{/* Gender */}
							<div className="flex flex-col  justify-start mb-5 gap-3">
								<label
									className="font-bold capitalize text-gray-200"
									htmlFor="gender"
								>
									Gender
								</label>
								<input
									type="text"
									readOnly={true}
									className="hover:text-gray-200 hover:border-gray-200  p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1"
									name=""
									id="gender"
									onClick={() =>
										showModal({
											type: ModalType.GENDER_CHANGER,
											accountStateDispatch: setAccountState,
											gender: accountState.gender || "Prefer Not To Say",
										})
									}
									value={accountState.gender as string}
								></input>
							</div>
							<div className="flex flex-col justify-start mb-5 gap-3">
								<label
									className="font-bold capitalize text-gray-200"
									htmlFor="dob"
								>
									DOB
								</label>
								<input
									// readOnly={userProfile?.birth_date !== null}
									readOnly={true}
									type="date"
									className="hover:text-gray-200  hover:border-gray-200 p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1"
									name=""
									id="dob"
									value={userProfile?.birth_date || ""}
								/>
							</div>

							<div className="flex flex-col justify-start mb-5 gap-3">
								<label
									className="font-bold capitalize text-gray-200"
									htmlFor="bio"
								>
									Account Type
								</label>

								<select
									name=""
									onChange={(ev) =>
										setAccountState((prev) => ({
											...prev,
											accountType: ev.target.value as AccountType,
										}))
									}
									className="p-2 bg-transparent border-[1px] border-neutral-700 rounded flex-1 w-full"
									id="account-type"
									value={accountState.accountType ?? "..."}
								>
									{ACCOUNT_TYPE_CHOICES.map((accountType, idx) => (
										<option key={idx} value={accountType} className="bg-black">
											{accountType}
										</option>
									))}
								</select>
							</div>

							<div className="mt-2 place-self-center md:col-span-2">
								<input
									disabled={editStatus.isUpdating}
									className="py-2 px-3 bg-violet-700 font-bold cursor-pointer rounded-lg disabled:cursor-not-allowed hover:bg-violet-900"
									type="submit"
									value={editStatus.isUpdating ? "Updating..." : "Save"}
								/>
							</div>
						</form>
					</section>
				</div>
			)}
		</div>
	);
};

export default EditAccount;
