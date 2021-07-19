const userResponse = (uid, user) => {
  const {
    displayName,
    username,
    avatar,
    coverPhoto,
    bio,
    following,
    createdAt,
    updatedAt,
  } = user;
  return {
    uid,
    displayName,
    username,
    avatar,
    coverPhoto,
    bio,
    following,
    createdAt: createdAt.toDate().toString(),
    updatedAt: updatedAt.toDate().toString(),
  };
};

const postResponse = (postId, post) => {
  const { author, content, likedBy, commentCount, createdAt, updatedAt } = post;
  return {
    postId,
    author,
    content,
    likedBy,
    commentCount,
    createdAt: createdAt.toDate().toString(),
    updatedAt: updatedAt.toDate().toString(),
  };
};

const commentResponse = (commentId, comment) => {
  const { author, postId, content, createdAt, updatedAt } = comment;
  return {
    commentId,
    postId,
    author,
    content,
    createdAt: createdAt.toDate().toString(),
    updatedAt: updatedAt.toDate().toString(),
  };
};

const followingResponse = (profileId, profile) => {
  if (!profile) return null;
  const { uid, displayName, username, avatar, bio, createdAt } = profile;
  return {
    profileId,
    uid,
    displayName,
    username,
    avatar,
    bio,
    createdAt: createdAt.toDate().toString(),
  };
};

const handleApiError = (err) => {
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  throw new Error(err.message);
};

export {
  userResponse,
  postResponse,
  commentResponse,
  followingResponse,
  handleApiError,
};
