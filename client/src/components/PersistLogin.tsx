import { Outlet, Navigate } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Loading from "./Loading";

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
	}, []);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : !isLoading && !auth.accessToken && !auth.user ? (
				<Navigate to="/login" />
			) : (
				<Outlet />
			)}
		</>
	);
};

export default PersistLogin;
