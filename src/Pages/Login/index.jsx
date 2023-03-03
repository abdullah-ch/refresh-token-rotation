import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "../../Store/Slices/userSlice";

const Login = () => {
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    email: null,
    password: null,
  });
  const navigate = useNavigate();

  const handleCredentials = (e) => {
    const { value, name } = e.target;
    if (name === "email") {
      setCredentials((prevState) => {
        return { ...prevState, email: value };
      });
    } else if (name === "password") {
      setCredentials((prevState) => {
        return { ...prevState, password: value };
      });
    }
    console.log("credentials are ====> ", credentials);
  };

  const login = async () => {
    try {
      // redirect to home
      dispatch(logIn(credentials));
      navigate("/");
    } catch (error) {
      console.log("error ==> ", error);
      alert(error?.response?.data?.errors[0]);
    }
  };

  const handleLogin = () => {
    if (!credentials.email) {
      return alert("Please enter an Email !");
    }
    if (!credentials.password) {
      return alert("Please enter a Password!");
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
      <input />
    </div>
  );
};

export default Login;
