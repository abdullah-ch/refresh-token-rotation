import { createSlice } from "@reduxjs/toolkit";
// import { removeCookies } from "../../utils";
import { PURGE } from "redux-persist";
import { getUser } from "../../Services/user";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: null,
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    setLogIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      state = null;
    });
  },
});

export const { setUser, setLogIn } = userSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch

export const getCurrentUser = () => {
  return async (dispatch) => {
    try {
      const response = await getUser();
      console.log("user data ====> ", response.data.user);
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.log("error ==> getCurrentUser ==>", error);
      //   alert(error?.response?.data?.errors[0]);
    }
  };
};
export const logOutUser = () => {
  return async (dispatch) => {
    try {
      //   const response = await signOutUser();
      //   console.log("Response ===> logOutUser", response.data);
      //   // purge any persisted State
      //   //   purgePersistance();
      //   //   console.log("purge ===> ", persistor);
      //   // remove all cookies
      //   removeCookies();
      //   window.location.href = "/signin";
    } catch (error) {
      console.log("error ==> getCurrentUser ==>", error);
      alert(error?.response?.data?.errors[0]);
    }
  };
};

export const selectUser = (state) => state.user.value;
export const selectUserLoginState = (state) => state.user.isLoggedIn;

export default userSlice.reducer;
