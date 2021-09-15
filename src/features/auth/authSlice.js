import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadPosts } from "../feed/feedSlice";
import * as authService from "../../services/auth";

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, password }) => {
    const response = await authService.signup(email, password);
    return response;
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async ({ email, password }) => {
    const response = await authService.signin(email, password);
    return response;
  }
);

export const signout = createAsyncThunk("auth/signout", async () => {
  const response = await authService.signout();
  return response;
});

export const fetchUserById = createAsyncThunk(
  "auth/user",
  async (uid, { dispatch }) => {
    const response = await authService.fetchUserById(uid);
    if (response) {
      dispatch(loadPosts({ uid, following: response.following }));
    }
    return response;
  }
);

export const completeSignup = createAsyncThunk(
  "auth/user/register",
  async ({ uid, formData }) => {
    const response = await authService.completeSignup(uid, formData);
    return response;
  }
);

export const updateUser = createAsyncThunk(
  "auth/user/update",
  async ({ uid, formDataObj }, { dispatch }) => {
    const response = await authService.updateUser(uid, formDataObj);
    dispatch(fetchUserById(uid));
    return response;
  }
);

export const initialState = {
  status: "idle",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userInitialized: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [signup.fulfilled]: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    [signin.fulfilled]: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    [signout.fulfilled]: (state) => {
      state.user = null;
    },
    [fetchUserById.pending]: (state) => {
      state.status = "loading";
    },
    [fetchUserById.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.user = { ...state.user, ...action.payload };
    },
    [fetchUserById.rejected]: (state) => {
      state.status = "error";
    },
  },
});

export const { userInitialized } = authSlice.actions;

export default authSlice.reducer;
