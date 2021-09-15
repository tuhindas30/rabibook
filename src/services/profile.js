import firebase, { db } from "../firebase";
import { followingResponse, handleApiError, userResponse } from "./helper";

const fieldValue = firebase.firestore.FieldValue;

const fetchUserByUsername = async (username) => {
  try {
    const response = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    const user = response.docs[0];
    return userResponse(user.id, user.data());
  } catch (err) {
    return handleApiError(err);
  }
};

const fetchFollowings = async (uid) => {
  try {
    const response = await db.collection(`users/${uid}/followings`).get();
    return response.docs.map((following) =>
      followingResponse(following.id, following.data())
    );
  } catch (err) {
    return handleApiError(err);
  }
};

const isProfileAdded = async (uid, profileData) => {
  try {
    await db.doc(`users/${uid}/followings/${profileData.uid}`).set({
      ...profileData,
      createdAt: fieldValue.serverTimestamp(),
    });
    return true;
  } catch (err) {
    return handleApiError(err);
  }
};

const followProfile = async (uid, profileData) => {
  try {
    if (await isProfileAdded(uid, profileData)) {
      await db.doc(`users/${uid}`).set(
        {
          following: fieldValue.arrayUnion(profileData.uid),
        },
        { merge: true }
      );
      return true;
    }
  } catch (err) {
    return handleApiError(err);
  }
};

const isProfileRemoved = async (uid, profileId) => {
  try {
    await db.doc(`users/${uid}/followings/${profileId}`).delete();
    return true;
  } catch (err) {
    return handleApiError(err);
  }
};

const unFollowProfile = async (uid, profileId) => {
  try {
    if (await isProfileRemoved(uid, profileId)) {
      await db.doc(`users/${uid}`).set(
        {
          following: fieldValue.arrayRemove(profileId),
        },
        { merge: true }
      );
      return true;
    }
  } catch (err) {
    handleApiError(err);
  }
};

export { fetchUserByUsername, fetchFollowings, followProfile, unFollowProfile };
