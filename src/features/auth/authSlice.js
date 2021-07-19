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

export const signupComplete = createAsyncThunk(
  "auth/user/register",
  async ({ uid, formDataObj }) => {
    const response = await authService.signupComplete(uid, formDataObj);
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
  uid: null,
  email: null,
  displayName: null,
  username: null,
  bio: null,
  avatar: null,
  coverPhoto: null,
  following: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [signup.fulfilled]: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isRecentlySignedUp = true;
    },
    [signin.fulfilled]: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
    },
    [signout.fulfilled]: (state) => {
      state.uid = null;
      state.email = null;
    },
    [fetchUserById.pending]: (state) => {
      state.status = "loading";
    },
    [fetchUserById.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      if (action.payload) {
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
        state.username = action.payload.username;
        state.avatar = action.payload.avatar;
        state.coverPhoto = action.payload.coverPhoto;
        state.bio = action.payload.bio;
        state.following = action.payload.following;
      }
    },
    [fetchUserById.rejected]: (state) => {
      state.status = "error";
    },
  },
});

export default authSlice.reducer;
