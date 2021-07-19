import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as commentService from "../../services/comment";

export const loadComments = createAsyncThunk(
  "comments/load",
  async (postId) => {
    const response = await commentService.fetchComments(postId);
    return response;
  }
);

export const commentPost = createAsyncThunk(
  "comments/add",
  async ({ postId, commentData }) => {
    const response = await commentService.commentPost(postId, commentData);
    return response;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async ({ postId, commentId }) => {
    await commentService.deleteComment(postId, commentId);
    return commentId;
  }
);

const initialState = {
  status: "idle",
  comments: [],
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers: {
    [loadComments.pending]: (state) => {
      state.status = "loading";
    },
    [loadComments.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.comments = action.payload;
    },
    [loadComments.rejected]: (state) => {
      state.status = "error";
    },
    [commentPost.fulfilled]: (state, action) => {
      state.comments.unshift(action.payload);
    },
    [deleteComment.fulfilled]: (state, action) => {
      const commentIndex = state.comments.findIndex(
        (comment) => comment.commentId === action.payload
      );
      if (commentIndex > -1) {
        state.comments.splice(commentIndex, 1);
      }
    },
  },
});

export default commentSlice.reducer;
