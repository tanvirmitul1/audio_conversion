/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  // const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAuthenticated = true;
  const user = { role: "admin" };
  if (!isAuthenticated || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
