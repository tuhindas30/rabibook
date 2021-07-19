import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { FaTelegramPlane } from "react-icons/fa";
import CommentList from "../CommentList/CommentList";

const CommentModal = ({
  isModalShown,
  modalData,
  onHide,
  onSend,
  onDelete,
}) => {
  const { comments } = useSelector((state) => state.comments);
  const [commentInput, setCommentInput] = useState("");
  const [isDisabled, setDisabled] = useState(true);

  const handleSend = () => {
    const commentData = {
      author: {
        uid: modalData.uid,
        ...modalData.data,
      },
      content: commentInput,
    };
    setCommentInput("");
    setDisabled(true);
    onSend(modalData.postId, commentData);
  };

  const activateBtn = (e) => {
    const text = e.target.value;
    setCommentInput(text);
    setDisabled(true);
    if (text.length > 0) {
      return setDisabled(false);
    }
  };

  return (
    <Modal
      centered
      fullscreen="sm-down"
      show={isModalShown}
      onHide={() => onHide(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            as="textarea"
            value={commentInput}
            onChange={activateBtn}
            placeholder="Say something ..."
            aria-label="Comments"
            aria-describedby="basic-addon2"
          />
          <Button
            onClick={handleSend}
            disabled={isDisabled}
            variant="outline-secondary"
            className={`outline ${isDisabled ? "not-allowed" : "pointer"}`}>
            <FaTelegramPlane />
          </Button>
        </InputGroup>
        <ListGroup variant="flush">
          {comments.map((comment) => (
            <CommentList
              key={comment.commentId}
              comment={comment}
              onDelete={() => onDelete(modalData.postId, comment.commentId)}
            />
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;
