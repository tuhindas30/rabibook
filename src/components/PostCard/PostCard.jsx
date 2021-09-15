import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Image, Row, Col, ListGroup } from "react-bootstrap";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiComment, BiTrash } from "react-icons/bi";
import { useLike } from "../../hooks/useLike";
import { dateToRelativeTime } from "../../helpers/date";
import { loadComments } from "../../features/comments/commentSlice";
import styles from "./PostCard.module.css";

const PostCard = ({ post, onLike, onRemoveLike, onDelete, onComment }) => {
  const { uid, displayName, username, avatar } = useSelector(
    (state) => state.auth
  );
  const isCurrentUserPost = post.author.uid === uid ? true : false;
  const isPostLiked = post.likedBy?.includes(uid);
  const dispatch = useDispatch();
  const { isLiked, setLiked, likePost, removeLike } = useLike(
    post.postId,
    post?.likedBy
  );

  useEffect(() => {
    setLiked(isPostLiked);
  }, [isPostLiked, setLiked]);

  const handleLike = async () => {
    const response = await likePost(post.postId, uid);
    if (response) {
      onLike(post.postId);
    }
  };

  const handleRemoveLike = async () => {
    const response = await removeLike(post.postId, uid);
    if (response) {
      onRemoveLike(post.postId);
    }
  };

  const handleComment = (postId, uid) => {
    const data = {
      displayName,
      username,
      avatar,
    };
    dispatch(loadComments(post.postId));
    onComment(postId, uid, data);
  };

  return (
    <ListGroup.Item>
      <Link to={`/post/${post.postId}`}>
        <Row className={styles.listHeader}>
          <Col xs={2}>
            <Image
              src={post.author.avatar}
              className={styles.listAvatar}
              roundedCircle
            />
          </Col>
          <Col>
            <div className={styles.listTitle}>
              <span className={styles.displayName}>
                {post.author.displayName}
              </span>
              <span className={styles.username}>@{post.author.username}</span>
              &middot;
              <span className={styles.postTime}>
                {dateToRelativeTime(post.createdAt)}
              </span>
            </div>
            <div>{post.content}</div>
          </Col>
        </Row>
      </Link>
      <Row>
        <Col className={styles.footerItem}>
          <BiComment
            onClick={() => handleComment(post.postId, uid)}
            className={`pointer ${styles.iconMargin}`}
          />
          <span>{post.commentCount}</span>
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
          <span>{post.likedBy.length}</span>
        </Col>
        {isCurrentUserPost && (
          <Col className={styles.footerItem}>
            <BiTrash
              onClick={() => onDelete(post.postId)}
              className={`pointer ${styles.trashIcon}`}
            />
          </Col>
        )}
      </Row>
    </ListGroup.Item>
  );
};

export default PostCard;
