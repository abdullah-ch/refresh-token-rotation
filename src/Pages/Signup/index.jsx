import React, { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../../Services/auth';
import { useAlert } from 'react-alert';
import { ACTIONS, signupReducer } from '../../Reducers/signupReducer';
import SpinnerButton from '../../Components/Button';

const initialState = {
  userDetails: '',
  loading: false,
  error: null,
};
export const Signup = () => {
  const [state, dispatcher] = useReducer(signupReducer, initialState);
  const { loading } = state;

  const navigate = useNavigate();
  const alert = useAlert();

  const [credentials, setCredentials] = useState({
    email: null,
    password: null,
    name: null,
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
    } else if (name === 'name') {
      setCredentials((prevState) => {
        return { ...prevState, name: value };
      });
    }
  };

  const signUp = async () => {
    try {
      dispatcher({
        type: ACTIONS.CALL_API,
      });
      const { data } = await signUpUser(credentials);
      dispatcher({
        type: ACTIONS.SUCCESS,
        data: data,
      });
      navigate('/login');
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

  const handleSignUp = () => {
    if (!credentials.email) {
      return alert.error('Please enter an Email !');
    }
    if (!credentials.password) {
      return alert.error('Please enter a Password!');
    }
    if (!credentials.name) {
      return alert.error('Please enter a Name!');
    }

    signUp();
  };

  return (
    <div className="flex justify-center items-center flex-col w-full h-screen gap-3">
      <input
        onChange={handleCredentials}
        className="border rounded-md border-solid border-black p-1"
        placeholder="name"
        name="name"
      />
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
        handleClick={handleSignUp}
        label={'Submit'}
        isLoading={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
      <div>
        Already have an account ?{' '}
        <a href="login" className="text-blue-600">
          Login Here !
        </a>
      </div>
    </div>
  );
};
