import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { logInUser } from '../../Services/auth';
import { getUser } from '../../Services/user';

export const userSlice = createSlice({
  name: 'user',
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
    resetState: (state, action) => {
      state = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      state = null;
    });
  },
});

export const { setUser, setLogIn, resetState } = userSlice.actions;

export const logIn = (userInfo) => {
  return async (dispatch) => {
    try {
      const response = await logInUser(userInfo);
      // set the access token in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      dispatch(setLogIn(true));
      window.location.href = '/';
    } catch (error) {
      alert(error?.response?.data?.errors[0]);
    }
  };
};

export const getCurrentUser = () => {
  return async (dispatch) => {
    try {
      const response = await getUser();
      dispatch(setUser(response.data.user));
    } catch (error) {
      //   alert(error?.response?.data?.errors[0]);
    }
  };
};
// export const logOutUser = () => {
//   return async (dispatch) => {
//     try {
//     } catch (error) {
//       console.log("error ==> getCurrentUser ==>", error);
//       alert(error?.response?.data?.errors[0]);
//     }
//   };
// };

export const selectUser = (state) => state.user.value;
export const selectUserLoginState = (state) => state.user.isLoggedIn;

export default userSlice.reducer;
