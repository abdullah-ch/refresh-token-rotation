import React from "react";
import Header from "../Components/Header";

const HeaderLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default HeaderLayout;
