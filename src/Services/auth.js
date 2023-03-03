import axios from "./index";

export const signIn = (userInfo) =>
  axios.post("/auth/sign-up", {
    userInfo,
  });

export const logIn = (userInfo) =>
  axios.post("/auth/login", {
    userInfo,
  });
