import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {  selectUserLoginState } from '../Store/Slices/userSlice';
import HeaderLayout from '../Layouts/Header';

function Protected() {
  const isSignedIn = useSelector(selectUserLoginState);

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
