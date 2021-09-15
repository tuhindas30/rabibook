import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import styles from "./CreatePostForm.module.css";

const MAX_CHAR_LIMIT = 500;

const PostForm = ({ onButtonClick, isLoading }) => {
  const [content, setContent] = useState("");
  const isDisabled = content.length === 0 || content.length > MAX_CHAR_LIMIT;

  const handlePostBtnClick = (content) => {
    onButtonClick(content);
    setContent("");
  };

  return (
    <Row>
      <Col>
        <Form.Control
          as="textarea"
          value={content}
          placeholder="Post a reading insight"
          rows={3}
          onChange={(e) => setContent(e.target.value)}
        />
        <Row className={styles.characterCount}>
          <Col>
            Characters: {content.length}/{MAX_CHAR_LIMIT}
          </Col>
        </Row>
        <Row className={styles.btnContainer}>
          <Col>
            <Button
              onClick={() => handlePostBtnClick(content)}
              disabled={isDisabled}
              className={`button ${isDisabled ? "not-allowed" : "pointer"}`}>
              Post
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PostForm;
