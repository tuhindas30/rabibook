import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as postService from "../../services/post";

export const createPost = createAsyncThunk(
  "feed/post/create",
  async (postObj) => {
    const response = await postService.createPost(postObj);
    return response;
  }
);

export const deletePostFromFeed = createAsyncThunk(
  "feed/post/delete",
  async (postId) => {
    const response = await postService.deletePost(postId);
    return response;
  }
);

export const loadPosts = createAsyncThunk(
  "feed/loadPosts",
  async ({ uid, following }) => {
    const response = await postService.fetchPosts(uid, following);
    return response;
  }
);

const initialState = {
  status: "idle",
  posts: [],
};

const postSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    likeBtnClicked: (state, action) => {
      const { posts } = state;
      const { postId } = action.payload;
      const postIndex = posts.findIndex((post) => post.postId === postId);
      if (postIndex < 0) return;
      posts[postIndex].likedBy.length = posts[postIndex].likedBy?.length + 1;
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
  },
  extraReducers: {
    [loadPosts.pending]: (state) => {
      state.status = "loading";
    },
    [loadPosts.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.posts = action.payload;
    },
    [loadPosts.rejected]: (state) => {
      state.status = "error";
    },
    [createPost.fulfilled]: (state, action) => {
      state.posts.unshift(action.payload);
    },
  },
});

export const {
  likeBtnClicked,
  removeLikeBtnClicked,
  sendBtnClicked,
  deleteBtnClicked,
  deletePostBtnClicked,
} = postSlice.actions;

export default postSlice.reducer;
