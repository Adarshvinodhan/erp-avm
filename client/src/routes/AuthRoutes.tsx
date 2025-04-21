import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
    const isAuthenticated = !!localStorage.getItem("token"); 

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoutes;
