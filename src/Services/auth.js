import axios from "./axiosConfig";

export const signUpUser = (userInfo) => axios.post("/auth/sign-up", userInfo);

export const logInUser = (userInfo) => axios.post("/auth/login", userInfo);

export const refreshTokens = () => axios.get("/auth/refresh");

export const logOut = () => axios.get("/auth/log-out");
