import { useState } from "react";
import { useSelector } from "react-redux";
import * as likeService from "../services/like";

const useLike = (postId, likedBy) => {
  const { uid } = useSelector((state) => state.auth);
  const [isLiked, setLiked] = useState(likedBy?.includes(uid));

  const likePost = async () => {
    try {
      const response = await likeService.likePost(postId, uid);
      if (response) {
        setLiked(true);
        return response;
      }
    } catch (err) {}
  };

  const removeLike = async () => {
    try {
      const response = await likeService.removeLike(postId, uid);
      if (response) {
        setLiked(false);
        return true;
      }
    } catch (err) {}
  };

  return { isLiked, setLiked, likePost, removeLike };
};

export { useLike };
