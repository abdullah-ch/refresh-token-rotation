import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectUserLoginState } from "../Store/Slices/userSlice";
import HeaderLayout from "../Layouts/Header";

function Protected() {
  const isSignedIn = useSelector(selectUserLoginState);
  const userInfo = useSelector(selectUser);

  console.log("userINfor =======> ", userInfo);
  console.log("isSignedIn ===> Protected ===> ", isSignedIn);
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <HeaderLayout>
      <Outlet />
    </HeaderLayout>
  );
}
export default Protected;
