import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadComments } from "../comments/commentSlice";
import * as postService from "../../services/post";

export const fetchPostById = createAsyncThunk(
  "post/fetchPostById",
  async (postId, { dispatch }) => {
    const response = await postService.fetchPostById(postId);
    dispatch(loadComments(postId));
    return response;
  }
);

const initialState = {
  status: "idle",
  post: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    likeBtnClicked: (state) => {
      const { post } = state;
      post.likedBy.length = post.likedBy.length + 1;
    },
    removeLikeBtnClicked: (state) => {
      const { post } = state;
      post.likedBy.length = post.likedBy.length - 1;
    },
    sendBtnClicked: (state) => {
      const { post } = state;
      post.commentCount = post.commentCount + 1;
    },
  },
  extraReducers: {
    [fetchPostById.pending]: (state) => {
      state.status = "loading";
    },
    [fetchPostById.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.post = { ...action.payload };
    },
    [fetchPostById.rejected]: (state) => {
      state.status = "error";
    },
  },
});

export const { likeBtnClicked, removeLikeBtnClicked, sendBtnClicked } =
  postSlice.actions;

export default postSlice.reducer;
