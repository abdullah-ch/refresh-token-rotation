import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../Services/auth";

export const Signup = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: null,
    password: null,
    name: null,
  });

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
    } else if (name === "name") {
      setCredentials((prevState) => {
        return { ...prevState, name: value };
      });
    }
    console.log("credentials are ====> ", credentials);
  };

  const signUp = async () => {
    try {
      // redirect to home
      // dispatch(logIn(credentials));
      await signUpUser(credentials);
      navigate("/login");
    } catch (error) {
      console.log("error ==> ", error);
      alert(error?.response?.data?.errors[0]);
    }
  };

  const handleSignUp = () => {
    if (!credentials.email) {
      return alert("Please enter an Email !");
    }
    if (!credentials.password) {
      return alert("Please enter a Password!");
    }
    if (!credentials.name) {
      return alert("Please enter a Name!");
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
      <button
        onClick={handleSignUp}
        className="border rounded-md border-solid border-black p-1"
      >
        Submit
      </button>
      <div>
        Already have an account ?{" "}
        <a href="login" className="text-blue-600">
          Login Here !
        </a>
      </div>
    </div>
  );
};
