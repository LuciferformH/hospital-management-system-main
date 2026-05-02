import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles }) => {
    let currentUser = useSelector((state) => state.user.currentUser);

    if (!currentUser) {
        return <Navigate to={"/sign-in"} />
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to={"/"} />
    }

    return <Outlet />;
}

export default PrivateRoute;

