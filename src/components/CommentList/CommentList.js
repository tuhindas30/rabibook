import { Col, Image, ListGroup, Row } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { dateToRelativeTime } from "../../helpers/date";
import styles from "./CommentList.module.css";

const CommentList = ({ comment, onDelete }) => {
  const { uid } = useSelector((state) => state.auth);
  const isUserComment = comment.author.uid === uid ? true : false;

  return (
    <ListGroup.Item key={comment.commentId}>
      <Row>
        <Col xs={2}>
          <Image
            src={comment.author.avatar}
            className={styles.commentAvatar}
            roundedCircle
          />
        </Col>
        <Col>
          <span className={styles.displayName}>
            {comment.author.displayName}
          </span>
          &middot;
          <span className={styles.commentTime}>
            {dateToRelativeTime(comment.createdAt)}
          </span>
          <div>{comment.content}</div>
        </Col>
        {isUserComment && (
          <Col xs={2} className={styles.trash}>
            <BiTrash
              onClick={() => onDelete(comment.postId, comment.commentId)}
              className={`pointer ${styles.trashIcon}`}
            />
          </Col>
        )}
      </Row>
    </ListGroup.Item>
  );
};

export default CommentList;
