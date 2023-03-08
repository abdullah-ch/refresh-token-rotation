import React from "react";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../Services/auth";
import { persistor } from "../../Store/store.js";

const Header = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };
  const handlelogOut = async () => {
    try {
      await logOut();
      localStorage.clear();
      await persistor.purge();
      navigate("/login");
    } catch (error) {
      console.log("error ===> ", error);
      alert(error?.response?.data?.errors[0]);
    }
  };
  return (
    <header className="flex justify-between m-2 bg-yellow-200">
      <div>
        <span onClick={handleHome} className="">
          Home
        </span>
        {/* <span onClick={handleDashboard}>Dashboard</span> */}
      </div>
      <div>
        <button onClick={handlelogOut}>Log Out</button>
      </div>
    </header>
  );
};

export default Header;
