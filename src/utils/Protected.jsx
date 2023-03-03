import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserLoginState } from "../Store/Slices/userSlice";

function Protected() {
  const isSignedIn = useSelector(selectUserLoginState);
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
export default Protected;
