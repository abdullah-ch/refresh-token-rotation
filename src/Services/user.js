import axios from "./axiosConfig.js";

export const getUser = () => axios.get("user");
