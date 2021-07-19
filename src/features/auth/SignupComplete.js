import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, storage } from "../../firebase";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Navigation } from "../../components";
import { isUsernameExist } from "../../services/auth";
import { fetchUserById, signupComplete } from "./authSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import styles from "./SignupComplete.module.css";

const MAX_AVATAR_SIZE = 500 * 1024;

const SignupComplete = () => {
  const { uid, username } = useSelector((state) => state.auth);
  const [isDisabled, setDisabled] = useState(true);
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    avatar: "",
    bio: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useDocumentTitle("Create your account on RabiBook");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        return navigate("/home");
      }
      const { uid } = user;
      dispatch(fetchUserById(uid));
      if (username) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate, username]);

  const handleFileInput = async (e) => {
    if (e.target.files[0]?.size > MAX_AVATAR_SIZE) {
      setError(`File size should be less than ${MAX_AVATAR_SIZE / 1024} KB`);
      setAlertDisplay(true);
      setDisabled(true);
      return;
    }
    setDisabled(false);
    await storeFileToFirebase(e, uid);
  };

  const storeFileToFirebase = async (e, uid) => {
    const avatarRef = storage.ref(`avatar/${uid}/${Date.now()}`);
    await avatarRef.put(e.target.files[0]);
    await avatarRef
      .getDownloadURL()
      .then((url) => setFormData((state) => ({ ...state, avatar: url })));
  };

  const handleInput = (e) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const checkValidation = (e) => {
    if (e.currentTarget.checkValidity()) {
      return setDisabled(false);
    }
    return setDisabled(true);
  };

  const handleRegisterUser = async (uid, formDataObj) => {
    const response = await dispatch(signupComplete({ uid, formDataObj }));
    if (!response.error) {
      return navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setAlertDisplay(false);
    setError("");
    if (await isUsernameExist(formData.username)) {
      return handleRegisterUser(uid, formData);
    }
    setAlertDisplay(true);
    return setError(`Username ${formData.username} not available`);
  };

  return (
    <>
      <Navigation />
      <Container className={styles.container}>
        <Row>
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
              onSubmit={handleSubmit}>
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
    </>
  );
};

export default SignupComplete;
