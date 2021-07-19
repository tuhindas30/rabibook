import firebase, { db } from "../firebase";
import { postResponse, handleApiError } from "./helper";

const fieldValue = firebase.firestore.FieldValue;

const createPost = async (postObj) => {
  try {
    const data = await db
      .collection("posts")
      .add({
        ...postObj,
        likedBy: [],
        commentCount: 0,
        createdAt: fieldValue.serverTimestamp(),
        updatedAt: fieldValue.serverTimestamp(),
      });
    const response = await data.get();
    const post = response.data();
    return postResponse(response.id, post);
  } catch (err) {
    return handleApiError(err);
  }
};

const deletePost = async (postId) => {
  try {
    await db.doc(`posts/${postId}`).delete();
    return true;
  } catch (err) {
    return handleApiError(err);
  }
};

const fetchPosts = async (uid, following) => {
  try {
    const response = await db
      .collection("posts")
      .where("author.uid", "in", [uid, ...following?.slice(0, 9)])
      .orderBy("createdAt", "desc")
      .get();
    return response.docs.map((post) => postResponse(post.id, post.data()));
  } catch (err) {
    return handleApiError(err);
  }
};

const fetchPostById = async (postId) => {
  try {
    const response = await db.doc(`posts/${postId}`).get();
    const post = await response.data();
    return postResponse(response.id, post);
  } catch (err) {
    return handleApiError(err);
  }
};

const fetchPostsByUsername = async (username) => {
  try {
    const response = await db
      .collection("posts")
      .where("author.username", "==", username)
      .orderBy("createdAt", "desc")
      .get();
    return response.docs.map((post) => postResponse(post.id, post.data()));
  } catch (err) {
    return handleApiError(err);
  }
};

export {
  createPost,
  deletePost,
  fetchPosts,
  fetchPostById,
  fetchPostsByUsername,
};
