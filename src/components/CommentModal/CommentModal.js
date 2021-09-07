import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { ReactComponent as Loader } from "../../assets/images/Loader.svg";
import { FaTelegramPlane } from "react-icons/fa";
import CommentList from "../CommentList/CommentList";

const CommentModal = ({
  isModalShown,
  modalData,
  onHide,
  onSend,
  onDelete,
}) => {
  const { comments, status } = useSelector((state) => state.comments);
  const [commentInput, setCommentInput] = useState("");
  const isDisabled = commentInput.length === 0;

  const handleSend = () => {
    const commentData = {
      author: {
        uid: modalData.uid,
        ...modalData.data,
      },
      content: commentInput,
    };
    setCommentInput("");
    onSend(modalData.postId, commentData);
  };

  const renderComments = () => {
    if (status === "loading") {
      return <Loader width="5rem" height="5rem" />;
    }
    if (comments.length > 0) {
      return comments.map((comment) => (
        <CommentList
          key={comment.commentId}
          comment={comment}
          onDelete={() => onDelete(modalData.postId, comment.commentId)}
        />
      ));
    }
    return "Be the first one to comment";
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
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Say something ..."
            aria-label="Comments"
          />
          <Button
            onClick={handleSend}
            disabled={isDisabled}
            variant="outline-secondary"
            className={`outline ${isDisabled ? "not-allowed" : "pointer"}`}>
            <FaTelegramPlane />
          </Button>
        </InputGroup>
        <ListGroup variant="flush">{renderComments()}</ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;
