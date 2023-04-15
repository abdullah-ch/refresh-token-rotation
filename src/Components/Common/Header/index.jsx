import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../../Services/auth';
import { persistor } from '../../../Store/store.js';
import { useAlert } from 'react-alert';

const Header = () => {
  const navigate = useNavigate();
  const alert = useAlert();

  const handleHome = () => {
    navigate('/');
  };
  const handlelogOut = async () => {
    try {
      await logOut();
      localStorage.clear();
      await persistor.purge();
      navigate('/login');
    } catch (error) {
      error?.response?.data?.errors.forEach((errObj) => {
        alert.error(errObj.message);
      });
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
