import firebase, { auth, db } from "../firebase";
import { handleApiError, userResponse } from "./helper";

const fieldValue = firebase.firestore.FieldValue;

const signup = async (emailId, password) => {
  try {
    const { uid, email } = await (
      await auth.createUserWithEmailAndPassword(emailId, password)
    ).user;
    return { uid, email };
  } catch (err) {
    return handleApiError(err);
  }
};

const signin = async (emailId, password) => {
  try {
    const { uid, email } = await (
      await auth.signInWithEmailAndPassword(emailId, password)
    ).user;
    return { uid, email };
  } catch (err) {
    return handleApiError(err);
  }
};

const signupComplete = async (uid, formData) => {
  try {
    return await db.doc(`users/${uid}`).set({
      ...formData,
      following: [],
      createdAt: fieldValue.serverTimestamp(),
      updatedAt: fieldValue.serverTimestamp(),
    });
  } catch (err) {
    return handleApiError(err);
  }
};

const signout = async () => {
  try {
    return await auth.signOut();
  } catch (err) {
    return handleApiError(err);
  }
};

const fetchUserById = async (uid) => {
  try {
    const response = await db.doc(`users/${uid}`).get();
    if (response.exists) {
      return userResponse(response.id, response.data());
    }
    return response.exists;
  } catch (err) {
    return handleApiError(err);
  }
};

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

const updateUser = async (uid, userData) => {
  try {
    return await db.doc(`users/${uid}`).set(userData, { merge: true });
  } catch (err) {
    return handleApiError(err);
  }
};

const isUsernameExist = async (username) => {
  const snapshot = await db
    .collection("users")
    .where("username", "==", username)
    .get();
  if (snapshot.empty) {
    return true;
  }
  return false;
};

export {
  signup,
  signin,
  signout,
  signupComplete,
  fetchUserById,
  fetchUserByUsername,
  updateUser,
  isUsernameExist,
};
