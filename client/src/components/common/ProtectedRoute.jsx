import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { currentUser } = useSelector((state) => state.user)
    console.log('currentUser', currentUser);

    return (
        <>
            {currentUser ? <Outlet /> : <Navigate to='/sign-in' />}
        </>
    )
}
