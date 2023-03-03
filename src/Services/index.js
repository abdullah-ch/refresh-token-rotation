import axios from "axios";
// import { persistor } from "../App/store";
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
  //   config.headers["uid"] = cookies.get("uid");
  //   config.headers["access-token"] = cookies.get("access-token");
  //   config.headers["client"] = cookies.get("client");

  return config;
});

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("error code ========> ", error.response.status);
    if (error.response.status === 401) {
      //   purge any persisted state
      //   persistor.purge().then(() => {
      //     removeCookies();
      //     window.location.href = "/signin";
      //   });
    }
    return Promise.reject(error);
  }
);
// logout on 401
export default instance;
