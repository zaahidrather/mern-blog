import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthRoute() {
	const { currentUser } = useSelector((state) => state.user);

	// If NO user is logged in, show the Auth pages (Login/Register)
	// If a user IS logged in, redirect them away (e.g., to the Dashboard or Home)
	return <>{!currentUser ? <Outlet /> : <Navigate to="/" />}</>;
}
