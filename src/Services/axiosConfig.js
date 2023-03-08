import axios from "axios";
// import { persistor } from "../Store/store.js";

// import { useDispatch } from "react-redux";
// import { resetState } from "../Store/Slices/userSlice.js";
// import { store } from "../Store/store.js";
let refreshingToken = null;

const instance = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

const refreshTokens = () => instance.get(`auth/refresh`);

instance.interceptors.request.use((config) => {
  // don't need to send cookies for sign_in API
  //   if (config.url === "auth/signin") {
  //     return config;
  //   }
  config.headers["authorization"] = localStorage.getItem("accessToken");

  return config;
});

instance.interceptors.response.use(
  function (response) {
    if (response.config.url === "auth/refresh") {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response;
  },
  async function (error) {
    const config = error.config;

    if (error.response && error.response.status === 401 && !config._retry) {
      config._retry = true;
      try {
        refreshingToken = refreshingToken ? refreshingToken : refreshTokens();
        await refreshingToken;
        refreshingToken = null;

        return instance(config);
      } catch (error) {
        return Promise.reject(error);
      }
    } else if (error.response.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
      // persistor();
      // persistor.purge().then(() => {});
      // const dispatch = useDispatch();
      // dispatch(resetState);
      // store.dispatch(resetState);
    }
    return Promise.reject(error);
  }
);
export default instance;
