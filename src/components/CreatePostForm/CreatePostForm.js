import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import styles from "./CreatePostForm.module.css";

const MAX_CHAR_LIMIT = 500;

const PostForm = ({ onButtonClick }) => {
  const [content, setContent] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const handleContentInput = (e) => {
    const character = e.target.value;
    setContent(character);
    if (character.length > 0 && character.length <= MAX_CHAR_LIMIT) {
      return setButtonDisabled(false);
    }
    return setButtonDisabled(true);
  };

  const handlePostBtnClick = (content) => {
    onButtonClick(content);
    setContent("");
    setButtonDisabled(true);
  };

  return (
    <Row>
      <Col>
        <Form.Control
          as="textarea"
          value={content}
          placeholder="Post a reading insight"
          rows={3}
          onChange={handleContentInput}
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
              disabled={isButtonDisabled}
              className={`button ${
                isButtonDisabled ? "not-allowed" : "pointer"
              }`}>
              Post
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PostForm;
