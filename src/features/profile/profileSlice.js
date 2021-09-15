import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadPosts } from "../feed/feedSlice";
import * as postService from "../../services/post";
import * as profileService from "../../services/profile";

export const fetchUserByUsername = createAsyncThunk(
  "profile/user",
  async (username, { dispatch }) => {
    const response = await profileService.fetchUserByUsername(username);
    dispatch(fetchPostsByUsername(username));
    dispatch(loadFollowings(response.uid));
    return response;
  }
);

export const fetchPostsByUsername = createAsyncThunk(
  "profile/posts",
  async (username) => {
    const response = await postService.fetchPostsByUsername(username);
    return response;
  }
);

export const deletePostFromProfile = createAsyncThunk(
  "profile/post/delete",
  async ({ postId, uid, following }, { dispatch }) => {
    await postService.deletePost(postId);
    dispatch(loadPosts({ uid, following }));
    return;
  }
);

export const loadFollowings = createAsyncThunk(
  "profile/followings",
  async (uid) => {
    const response = await profileService.fetchFollowings(uid);
    return response;
  }
);

export const followProfile = createAsyncThunk(
  "profile/follow",
  async ({ uid, following, profileData }, { dispatch }) => {
    const response = await profileService.followProfile(uid, profileData);
    dispatch(loadPosts({ uid, following }));
    return response;
  }
);

export const unFollowProfile = createAsyncThunk(
  "profile/unfollow",
  async ({ uid, following, profileId }, { dispatch }) => {
    const response = await profileService.unFollowProfile(uid, profileId);
    dispatch(loadPosts({ uid, following }));
    return response;
  }
);

export const initialState = {
  userStatus: "idle",
  postStatus: "idle",
  followingStatus: "idle",
  // uid: null,
  // displayName: null,
  // username: null,
  // bio: null,
  // avatar: null,
  // coverPhoto: null,
  // joinedOn: null,
  // posts: [],
  // followings: [],
  profile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    likeBtnClicked: (state, action) => {
      const { posts } = state;
      const { postId } = action.payload;
      const postIndex = posts.findIndex((post) => post.postId === postId);
      if (postIndex < 0) return;
      posts[postIndex].likedBy.length = posts[postIndex].likedBy.length + 1;
    },
    removeLikeBtnClicked: (state, action) => {
      const { posts } = state;
      const { postId } = action.payload;
      const postIndex = posts.findIndex((post) => post.postId === postId);
      if (postIndex < 0) return;
      posts[postIndex].likedBy.length = posts[postIndex].likedBy.length - 1;
    },
    sendBtnClicked: (state, action) => {
      const { posts } = state;
      const { postId } = action.payload;
      const postIndex = posts.findIndex((post) => post.postId === postId);
      if (postIndex < 0) return;
      posts[postIndex].commentCount = posts[postIndex].commentCount + 1;
    },
    deleteBtnClicked: (state, action) => {
      const { posts } = state;
      const { postId } = action.payload;
      const postIndex = posts.findIndex((post) => post.postId === postId);
      if (postIndex < 0) return;
      posts[postIndex].commentCount = posts[postIndex].commentCount - 1;
    },
    deletePostBtnClicked: (state, action) => {
      const { posts } = state;
      const { postId } = action.payload;
      const postIndex = posts.findIndex((post) => post.postId === postId);
      if (postIndex < 0) return;
      posts.splice(postIndex, 1);
    },
    unFollowBtnClicked: (state, action) => {
      const { followings } = state;
      const { profileId } = action.payload;
      const profileIndex = followings.findIndex(
        (profile) => profile.profileId === profileId
      );
      if (profileIndex < 0) return;
      followings.splice(profileIndex, 1);
    },
  },
  extraReducers: {
    [fetchUserByUsername.pending]: (state) => {
      state.userStatus = "loading";
    },
    [fetchUserByUsername.fulfilled]: (state, action) => {
      state.userStatus = "fulfilled";
      state.profile = { ...state.profile, ...action.payload };
      // state.uid = action.payload.uid;
      // state.displayName = action.payload.displayName;
      // state.username = action.payload.username;
      // state.avatar = action.payload.avatar;
      // state.coverPhoto = action.payload.coverPhoto;
      // state.bio = action.payload.bio;
      // state.joinedOn = action.payload.createdAt;
    },
    [fetchUserByUsername.rejected]: (state) => {
      state.userStatus = "error";
    },
    [fetchPostsByUsername.pending]: (state) => {
      state.postStatus = "loading";
    },
    [fetchPostsByUsername.fulfilled]: (state, action) => {
      state.postStatus = "fulfilled";
      state.posts = action.payload;
    },
    [fetchPostsByUsername.rejected]: (state) => {
      state.postStatus = "error";
    },
    [loadFollowings.pending]: (state) => {
      state.followingStatus = "loading";
    },
    [loadFollowings.fulfilled]: (state, action) => {
      state.followingStatus = "fulfilled";
      state.followings = [...action.payload];
    },
    [loadFollowings.rejected]: (state) => {
      state.followingStatus = "error";
    },
  },
});

export const {
  likeBtnClicked,
  removeLikeBtnClicked,
  sendBtnClicked,
  deleteBtnClicked,
  deletePostBtnClicked,
  unFollowBtnClicked,
} = profileSlice.actions;
export default profileSlice.reducer;
