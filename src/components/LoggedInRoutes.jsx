import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LoggedInRoutes = ({ children }) => {
	const { token, user } = useSelector(
		(state) => state.auth
	);

	if (!token || !user) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};

export default LoggedInRoutes;
