import firebase, { db } from "../firebase";
import { commentResponse, handleApiError } from "./helper";

const fieldValue = firebase.firestore.FieldValue;

const fetchComments = async (postId) => {
  try {
    const response = await db
      .collection(`posts/${postId}/comments`)
      .orderBy("createdAt", "desc")
      .get();
    return response.docs.map((comment) =>
      commentResponse(comment.id, comment.data())
    );
  } catch (err) {
    return handleApiError(err);
  }
};

const isCommentAdded = async (postId, commentData) => {
  try {
    const data = await db.collection(`posts/${postId}/comments`).add({
      postId,
      ...commentData,
      createdAt: fieldValue.serverTimestamp(),
      updatedAt: fieldValue.serverTimestamp(),
    });
    const response = await data.get();
    const comment = await response.data();
    return commentResponse(response.id, comment);
  } catch (err) {
    return handleApiError(err);
  }
};

const commentPost = async (postId, commentData) => {
  try {
    const response = await isCommentAdded(postId, commentData);
    if (response) {
      await db
        .doc(`posts/${postId}`)
        .set({ commentCount: fieldValue.increment(1) }, { merge: true });
    }
    return response;
  } catch (err) {
    return handleApiError(err);
  }
};

const isCommentDeleted = async (postId, commentId) => {
  try {
    await db.doc(`posts/${postId}/comments/${commentId}`).delete();
    return true;
  } catch (err) {
    return handleApiError(err);
  }
};

const deleteComment = async (postId, commentId) => {
  try {
    if (await isCommentDeleted(postId, commentId)) {
      await db
        .doc(`posts/${postId}`)
        .set({ commentCount: fieldValue.increment(-1) }, { merge: true });
      return true;
    }
  } catch (err) {
    return handleApiError(err);
  }
};

export { fetchComments, commentPost, deleteComment };
