import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logInUser } from '../../Services/auth';
import { setLogIn } from '../../Store/Slices/userSlice';
import { useAlert } from 'react-alert';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const [credentials, setCredentials] = useState({
    email: null,
    password: null,
  });

  const handleCredentials = (e) => {
    const { value, name } = e.target;
    if (name === 'email') {
      setCredentials((prevState) => {
        return { ...prevState, email: value };
      });
    } else if (name === 'password') {
      setCredentials((prevState) => {
        return { ...prevState, password: value };
      });
    }
    console.log('credentials are ====> ', credentials);
  };

  const login = async () => {
    try {
      // redirect to home
      // dispatch(logIn(credentials));
      const { data } = await logInUser(credentials);
      localStorage.setItem('accessToken', data.accessToken);
      dispatch(setLogIn(true));
      navigate('/');
    } catch (error) {
      console.log('error ==> ', error?.response?.data?.errors);

      error?.response?.data?.errors.forEach((errObj) => {
        alert.error(errObj.message);
      });
    }
  };

  const handleLogin = () => {
    if (!credentials.email) {
      return alert.error('Please enter an Email !');
    }
    if (!credentials.password) {
      return alert.error('Please enter a Password!');
    }

    // make the login API call here
    login();
  };

  return (
    <div className="flex justify-center items-center flex-col w-full h-screen gap-3">
      <input
        onChange={handleCredentials}
        className="border rounded-md border-solid border-black p-1"
        placeholder="email"
        name="email"
      />
      <input
        onChange={handleCredentials}
        className="border rounded-md border-solid border-black p-1"
        placeholder="password"
        type="password"
        name="password"
      />
      <button
        onClick={handleLogin}
        className="border rounded-md border-solid border-black p-1"
      >
        Submit
      </button>
      <div>
        Don't have an account ?{' '}
        <a href="signup" className="text-blue-600">
          {' '}
          Sign Up Here !
        </a>
      </div>
    </div>
  );
};

export default Login;
