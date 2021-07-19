import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { CommentList, CommentModal } from "../../components";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { dateToMonDDYYYY, dateToRelativeTime } from "../../helpers/date";
import { fetchUserById } from "../auth/authSlice";
import { commentPost, deleteComment } from "../comments/commentSlice";
import { loadPosts } from "../feed/feedSlice";
import { useLike } from "../../hooks/useLike";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import * as postSlice from "./postSlice";
import styles from "./Post.module.css";

const Post = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth);
  const { status, post } = useSelector((state) => state.post);
  const { comments } = useSelector((state) => state.comments);
  const [isModalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState(null);
  const isPostLiked = post?.likedBy.includes(authUser.uid);
  const { isLiked, setLiked, likePost, removeLike } = useLike(
    postId,
    post?.likedBy
  );
  const { fetchPostById, likeBtnClicked, removeLikeBtnClicked } = postSlice;

  const documentTitle =
    authUser.displayName && post?.content
      ? `${authUser.displayName} on RabiBook: ${post?.content}`
      : "RabiBook";

  useDocumentTitle(documentTitle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        return navigate("/home");
      }
      const { uid } = user;
      if (authUser.status === "idle") {
        dispatch(fetchUserById(uid));
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate, authUser.status]);

  useEffect(() => {
    dispatch(fetchPostById(postId));
    setLiked(isPostLiked);
  }, [dispatch, fetchPostById, postId, isPostLiked, setLiked]);

  const handleLike = async () => {
    const response = await likePost(postId, authUser.uid);
    if (response) {
      dispatch(likeBtnClicked({ postId }));
      dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
    }
  };

  const handleRemoveLike = async () => {
    const response = await removeLike(postId, authUser.uid);
    if (response) {
      dispatch(removeLikeBtnClicked({ postId }));
      dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
    }
  };

  const handleSendComment = async (postId, commentData) => {
    const response = await dispatch(commentPost({ postId, commentData }));
    if (response.error) return;
    dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
  };

  const handleDeleteComment = async (postId, commentId) => {
    const response = await dispatch(deleteComment({ postId, commentId }));
    if (response.error) return;
    dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
  };

  const handleComment = (postId, uid) => {
    const data = {
      displayName: authUser.displayName,
      username: authUser.username,
      avatar: authUser.avatar,
    };
    setModalShown(true);
    setModalData({ postId, uid, data });
  };

  if (authUser.status === "loading" || status === "loading") {
    return <h1 className="overlay">Loading ...</h1>;
  }

  return (
    <>
      <Card className={styles.card}>
        <Card.Body className={styles.cardBody}>
          <Row>
            <Col xs={2}>
              <Image
                src={post?.author.avatar}
                className={styles.cardAvatar}
                roundedCircle
              />
            </Col>
            <Col>
              <Card.Title className={styles.displayName}>
                {post?.author.displayName}
              </Card.Title>
              <Card.Subtitle className={`mb-2 ${styles.username}`}>
                @{post?.author.username}
              </Card.Subtitle>
              <Card.Text className={styles.content}>{post?.content}</Card.Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <span className={styles.postTime}>
                {dateToRelativeTime(post?.createdAt)} ago
              </span>
              &middot;
              <span className={styles.postDate}>
                {dateToMonDDYYYY(post?.createdAt)}
              </span>
            </Col>
          </Row>
        </Card.Body>
        <ListGroup>
          <ListGroup.Item>
            <span className={styles.likeCount}>
              {post?.likedBy.length} likes
            </span>
            <span className={styles.commentCount}>
              {comments.length} comments
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row className={styles.footer}>
              <Col className={styles.footerItem}>
                <BiComment
                  onClick={() => handleComment(post.postId, authUser.uid)}
                  className={`pointer ${styles.iconMargin}`}
                />
              </Col>
              <Col className={styles.footerItem}>
                {isLiked ? (
                  <AiFillHeart
                    onClick={handleRemoveLike}
                    className={`pointer ${styles.iconMargin} ${styles.iconColor}`}
                  />
                ) : (
                  <AiOutlineHeart
                    onClick={handleLike}
                    className={`pointer ${styles.iconMargin}`}
                  />
                )}
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
      <h5 className={styles.comment}>Comments</h5>
      {comments.map((comment) => (
        <CommentList
          key={comment.commentId}
          comment={comment}
          onDelete={handleDeleteComment}
        />
      ))}
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
