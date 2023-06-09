import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
	const { logout, auth } = useAuth();
	return (
		<div className="text-white flex gap-3 items-center justify-between px-5 py-3 border-b-[1px] border-slate-800 fixed z-10 w-full bg-neutral-900 shadow-2xl bg-opacity-60 backdrop-blur-xl">
			<div className="text-neutral-400 font-bold text hidden md:inline-flex">
				<span>Welcome {auth.user?.username} :&#41;</span>
			</div>

			<nav className="flex gap-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 font-bold">
				<Link to="/">Home</Link>
				<Link to="/create">Create</Link>
				<Link to="/explore">Explore</Link>
				<Link to={`/${auth.user?.username}`}>Profile</Link>
			</nav>

			<button
				className="bg-red-600 px-3 py-2 rounded text-white md:text-sm font-bold text-center hover:bg-red-700 text-xs"
				onClick={() => logout()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6 inline-block mx-1"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
					/>
				</svg>
				<span className="hidden md:inline-block">Logout</span>
			</button>
		</div>
	);
};

export default Navbar;
