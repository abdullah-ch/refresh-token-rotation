import axios from "axios";
import { refreshTokens } from "./auth";

// import { removeCookies } from "../utils";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  // don't need to send cookies for sign_in API
  //   if (config.url === "auth/sign_in") {
  //     return config;
  //   }
  config.headers["authorization"] = localStorage.getItem("accessToken");

  return config;
});

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response.status === 401) {
      try {
        const { data } = await refreshTokens();
        console.log("RESPONSE ===> refreshTokens ===> ", data);
        localStorage.setItem("accessToken", data.accessToken);
      } catch (error) {
        console.log("ERROR =====> REFRESH ", error);
      }
    } else if (error.response.status === 403) {
      //   purge any persisted state
      // console.log("PURGE ====> ", persistor);
      // persistor.purge().then(() => {
      //   console.log("PURGING !!!!");
      // });
    }
    return Promise.reject(error);
  }
);
export default instance;
