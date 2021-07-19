import firebase, { db } from "../firebase";
import { handleApiError } from "./helper";

const fieldValue = firebase.firestore.FieldValue;

const likePost = async (postId, uid) => {
  try {
    await db
      .doc(`posts/${postId}`)
      .set({ likedBy: fieldValue.arrayUnion(uid) }, { merge: true });
    return true;
  } catch (err) {
    return handleApiError(err);
  }
};

const removeLike = async (postId, uid) => {
  try {
    await db
      .doc(`posts/${postId}`)
      .set({ likedBy: fieldValue.arrayRemove(uid) }, { merge: true });
    return true;
  } catch (err) {
    return handleApiError(err);
  }
};

export { likePost, removeLike };
