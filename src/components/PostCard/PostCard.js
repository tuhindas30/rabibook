import { useEffect } from "react";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const { isLiked, setLiked, likePost, removeLike } = useLike(
    post.postId,
    post?.likedBy
  );

  useEffect(() => {
    setLiked(isPostLiked);
  }, [isPostLiked, setLiked]);

  const handleAvatarOrNameClick = (e, username) => {
    e.stopPropagation();
    navigate(`/${username}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const response = await likePost(post.postId, uid);
    if (response) {
      onLike(post.postId);
    }
  };

  const handleRemoveLike = async (e) => {
    e.stopPropagation();
    const response = await removeLike(post.postId, uid);
    if (response) {
      onRemoveLike(post.postId);
    }
  };

  const handleComment = (e, postId, uid) => {
    e.stopPropagation();
    const data = {
      displayName,
      username,
      avatar,
    };
    dispatch(loadComments(post.postId));
    onComment(postId, uid, data);
  };

  return (
    <ListGroup.Item
      className={styles.card}
      onClick={() => navigate(`/post/${post.postId}`)}>
      <Row className={styles.listHeader}>
        <Col xs={2}>
          <Image
            src={post.author.avatar}
            className={styles.listAvatar}
            onClick={(e) => handleAvatarOrNameClick(e, post.author.username)}
            roundedCircle
          />
        </Col>
        <Col>
          <div className={styles.listTitle}>
            <span
              className={styles.displayName}
              onClick={(e) => handleAvatarOrNameClick(e, post.author.username)}>
              {post.author.displayName}
            </span>
            <span
              className={styles.username}
              onClick={(e) => handleAvatarOrNameClick(e, post.author.username)}>
              @{post.author.username}
            </span>
            &middot;
            <span className={styles.postTime}>
              {dateToRelativeTime(post.createdAt)}
            </span>
          </div>
          <div>{post.content}</div>
        </Col>
      </Row>
      <Row>
        <Col className={styles.footerItem}>
          <div className={styles.commentBtn}>
            <BiComment
              onClick={(e) => handleComment(e, post.postId, uid)}
              className={`pointer ${styles.commentIcon}`}
            />
            <span className={styles.count}>{post.commentCount}</span>
          </div>
        </Col>
        <Col className={styles.footerItem}>
          <div className={styles.likeBtn}>
            {isLiked ? (
              <AiFillHeart
                onClick={handleRemoveLike}
                className={`pointer ${styles.likeIcon} ${styles.iconColor}`}
              />
            ) : (
              <AiOutlineHeart
                onClick={handleLike}
                className={`pointer ${styles.likeIcon}`}
              />
            )}
            <span className={styles.count}>{post.likedBy.length}</span>
          </div>
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
