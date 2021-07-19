import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { storage } from "../../firebase";
import styles from "./UpdateProfileForm.module.css";

const MAX_AVATAR_SIZE = 500 * 1024;
const MAX_COVER_PHOTO_SIZE = 500 * 1024;

const UpdateProfileForm = ({ onUpdate }) => {
  const authUser = useSelector((state) => state.auth);
  const [isDisabled, setDisabled] = useState(false);
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [error, setError] = useState("");
  const [isEditable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    displayName: authUser.displayName || "",
    bio: authUser.bio || "",
    avatar: authUser.avatar || "",
    coverPhoto: authUser.coverPhoto || "",
  });

  const handleInput = (e) =>
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));

  const handleFileInput = async (e) => {
    const fileSize =
      e.target.name === "coverPhoto" ? MAX_COVER_PHOTO_SIZE : MAX_AVATAR_SIZE;
    if (e.target.files[0]?.size > fileSize) {
      setError(`File size should be less than ${fileSize / 1024} KB`);
      setAlertDisplay(true);
      setDisabled(true);
      return;
    }
    setDisabled(false);
    const fileRef = storage.ref(
      `${e.target.name}/${authUser.uid}/${Date.now()}`
    );
    await fileRef.put(e.target.files[0]);
    await fileRef
      .getDownloadURL()
      .then((url) =>
        setFormData((state) => ({ ...state, [e.target.name]: url }))
      );
  };

  const checkValidation = (e) => {
    if (e.currentTarget.checkValidity()) {
      return setDisabled(false);
    }
    return setDisabled(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(authUser.uid, formData);
    setEditable(false);
    setAlertDisplay(false);
    setError("");
  };

  const handleButton = () => {
    setDisabled(false);
    setEditable((state) => !state);
  };

  return (
    <>
      <Row className={styles.coverPhotoContainer}>
        <Image
          src={
            formData.coverPhoto !== ""
              ? formData.coverPhoto
              : `https://cdn.statically.io/og/theme=dark/${
                  formData.displayName || "Cover Photo"
                }.jpg`
          }
          className={styles.coverPhoto}
        />
      </Row>
      <Image src={formData.avatar} className={styles.avatar} roundedCircle />
      <Row className={styles.profileInfo}>
        <Col>
          <div className={styles.displayName}>{formData.displayName}</div>
          <div className={styles.username}>@{authUser.username}</div>
        </Col>
      </Row>
      <Row className={styles.bio}>
        <Col>{formData.bio}</Col>
      </Row>
      <Row className={styles.formContainer}>
        <Col>
          <h2 className={styles.heading}>Update Profile</h2>
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
              <Form.Label>Username</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  defaultValue={authUser.username}
                  className="not-allowed"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  readOnly
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="displayName"
                value={formData.displayName}
                className={!isEditable ? "not-allowed" : "auto"}
                readOnly={!isEditable}
                onChange={handleInput}
                required
              />
              <Form.Control.Feedback type="invalid">
                Name cannot be blank.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.File
                name="avatar"
                label="Profile picture"
                accept="image/*"
                onChange={handleFileInput}
                disabled={!isEditable}
                className={!isEditable ? "not-allowed" : "auto"}
              />
            </Form.Group>
            <Form.Group>
              <Form.File
                name="coverPhoto"
                label="Cover Photo"
                accept="image/*"
                onChange={handleFileInput}
                disabled={!isEditable}
                className={!isEditable ? "not-allowed" : "auto"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                name="bio"
                placeholder="Few words about yourself"
                value={formData.bio}
                className={!isEditable ? "not-allowed" : "auto"}
                onChange={handleInput}
                readOnly={!isEditable}
                required
              />
              <Form.Control.Feedback type="invalid">
                Provide your short bio.
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              {isEditable && (
                <Col>
                  <Button
                    type="submit"
                    className={`button ${styles.button} ${
                      isDisabled ? "not-allowed" : "pointer"
                    }`}
                    disabled={isDisabled}>
                    Update
                  </Button>
                </Col>
              )}
              <Col>
                <Button
                  type="button"
                  onClick={handleButton}
                  className={`button ${styles.button}`}>
                  {isEditable ? "Cancel" : "Edit"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UpdateProfileForm;
