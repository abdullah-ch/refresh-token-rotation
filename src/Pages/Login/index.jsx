import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logInUser } from '../../Services/auth';
import { setLogIn } from '../../Store/Slices/userSlice';
import { useAlert } from 'react-alert';
import { useReducer } from 'react';
import { ACTIONS, loginReducer } from '../../Reducers/loginReducer';
import SpinnerButton from '../../Components/Button';

const initialState = {
  userDetails: '',
  loading: false,
  error: null,
};
const Login = () => {
  const [state, dispatcher] = useReducer(loginReducer, initialState);
  const { userDetails, loading } = state;

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
  };

  const login = async () => {
    try {
      dispatcher({
        type: ACTIONS.CALL_API,
      });
      const { data } = await logInUser(credentials);
      dispatcher({
        type: ACTIONS.SUCCESS,
        data: data,
      });
      localStorage.setItem('accessToken', userDetails.accessToken);
      dispatch(setLogIn(true));
      navigate('/');
    } catch (err) {
      dispatcher({
        type: ACTIONS.ERROR,
        data: err,
      });
      err?.response?.data?.errors?.forEach((errObj) => {
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
      <SpinnerButton
        handleClick={handleLogin}
        label={'Submit'}
        isLoading={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
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
