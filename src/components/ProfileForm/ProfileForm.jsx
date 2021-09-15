import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { db, storage } from "../../firebase";
import styles from "./ProfileForm.module.css";

const MAX_AVATAR_SIZE = 500 * 1024;

const ProfileForm = ({ onButtonClick }) => {
  const { uid } = useSelector((state) => state.auth);
  const [isDisabled, setDisabled] = useState(true);
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    avatar: "",
    bio: "",
  });

  const handleFileInput = async (e) => {
    if (e.target.files[0]?.size > MAX_AVATAR_SIZE) {
      setError(`File size should be less than ${MAX_AVATAR_SIZE / 1024} KB`);
      setAlertDisplay(true);
      setDisabled(true);
      return;
    }
    setDisabled(false);
    const avatarRef = storage.ref(`avatar/${uid}/${Date.now()}`);
    await avatarRef.put(e.target.files[0]);
    await avatarRef
      .getDownloadURL()
      .then((url) => setFormData((state) => ({ ...state, avatar: url })));
  };

  const handleInput = (e) =>
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));

  const checkValidation = (e) => {
    if (e.currentTarget.checkValidity()) {
      return setDisabled(false);
    }
    return setDisabled(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setAlertDisplay(false);
    setError("");
    const snapshot = await db
      .collection("users")
      .where("username", "==", formData.username)
      .get();
    if (snapshot.empty) {
      return onButtonClick(uid, formData);
    }
    setAlertDisplay(true);
    return setError(`Username ${formData.username} not available`);
  };

  return (
    <Container xs={2} className={styles.container}>
      <Row className={styles.formContainer}>
        <Col>
          <h2 className={styles.heading}>Create your account</h2>
          {alertDisplay && error && (
            <Alert
              variant="danger"
              onClose={() => setAlertDisplay(false)}
              dismissible>
              {error}
            </Alert>
          )}
          <Form
            noValidate
            validated
            onChange={checkValidation}
            onSubmit={handleSubmit}
            className={styles.formControl}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="displayName"
                value={formData.name}
                onChange={handleInput}
                required
              />
              <Form.Control.Feedback type="invalid">
                Provide your name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  required
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInput}
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
                <Form.Control.Feedback type="invalid">
                  Provide a valid username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Group>
                <Form.File
                  required
                  label="Profile picture"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                Provide your avatar.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Bio</Form.Label>
              <Form.Control
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleInput}
                required
              />
              <Form.Control.Feedback type="invalid">
                Provide your short bio.
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              type="submit"
              className={`button ${styles.button} ${
                isDisabled ? "not-allowed" : "pointer"
              }`}
              disabled={isDisabled}>
              Sign up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileForm;
