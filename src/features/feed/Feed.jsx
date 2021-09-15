import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { ListGroup } from "react-bootstrap";
import {
  CommentModal,
  CreatePostForm,
  PostCard,
  Search,
} from "../../components";
import { userInitialized, fetchUserById } from "../auth/authSlice";
import * as feedSlice from "./feedSlice";
import { commentPost, deleteComment } from "../comments/commentSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { ReactComponent as Loader } from "../../assets/images/Loader.svg";
import styles from "./Feed.module.css";
import { authResponse } from "../../services/helper";

const Post = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, user } = useSelector((state) => state.auth);
  const feed = useSelector((state) => state.feed);
  const [isModalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState({
    postId: "",
    uid: "",
    data: null,
  });
  const {
    createPost,
    deleteBtnClicked,
    deletePostBtnClicked,
    deletePostFromFeed,
    likeBtnClicked,
    removeLikeBtnClicked,
    sendBtnClicked,
  } = feedSlice;

  useDocumentTitle("RabiBook");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(userInitialized(authResponse(user)));
        if (status === "idle" || feed.status === "idle") {
          dispatch(fetchUserById(user.uid));
        }
      } else {
        navigate("/home");
      }
    });
    return unsubscribe;
  }, []);

  console.log(user);

  const handlePost = (content) => {
    const postObj = {
      author: {
        uid: user.uid,
        displayName: user.user.displayName,
        username: user.username,
        avatar: user.avatar,
      },
      content: content,
    };
    dispatch(createPost(postObj));
  };

  const handleDelete = (postId) => {
    const response = dispatch(deletePostFromFeed(postId));
    if (response.error) return;
    dispatch(deletePostBtnClicked({ postId }));
  };

  const handleComment = (postId, uid, data) => {
    setModalShown(true);
    setModalData({ postId, uid, data });
  };

  const handleSendComment = async (postId, commentData) => {
    const response = await dispatch(commentPost({ postId, commentData }));
    if (response.error) return;
    dispatch(sendBtnClicked({ postId }));
  };

  const handleDeleteComment = async (postId, commentId) => {
    const response = await dispatch(deleteComment({ postId, commentId }));
    if (response.error) return;
    dispatch(deleteBtnClicked({ postId }));
  };

  const handleLikeBtn = (postId) => {
    dispatch(likeBtnClicked({ postId }));
  };

  const handleRemoveLikeBtn = (postId) => {
    dispatch(removeLikeBtnClicked({ postId }));
  };

  if (feed.status === "loading" || status === "loading") {
    return (
      <div className="overlay">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Search />
      <CreatePostForm onButtonClick={handlePost} isLoading={feed.status} />
      <h4 className={styles.title}>Feed</h4>
      {feed.status === "error" && (
        <div className={styles.message}>Cannot load feed. Try again.</div>
      )}
      {feed.status === "fulfilled" && (
        <ListGroup>
          {feed.posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onLike={handleLikeBtn}
              onRemoveLike={handleRemoveLikeBtn}
              onDelete={handleDelete}
              onComment={handleComment}
            />
          ))}
        </ListGroup>
      )}
      <CommentModal
        isModalShown={isModalShown}
        modalData={modalData}
        onHide={setModalShown}
        onSend={handleSendComment}
        onDelete={handleDeleteComment}
      />
    </>
  );
};

export default Post;
