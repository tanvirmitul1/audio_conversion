/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // const { isAuthenticated } = useSelector((state) => state.auth);
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
