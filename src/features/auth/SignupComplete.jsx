import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, storage } from "../../firebase";
import { signupComplete, fetchUserById } from "./authSlice";
import { useLegacyState, useDocumentTitle } from "../../hooks";
import {
  DisplayName,
  FormButton,
  Navigation,
  UserAvatar,
  UserBio,
  Username,
} from "../../components";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import styles from "./SignupComplete.module.css";

const MAX_AVATAR_SIZE = 500 * 1024;

const SignupComplete = () => {
  const { uid, username } = useSelector((state) => state.auth);
  const [isValidated, setValidate] = useState(false);
  const [button, setButton] = useLegacyState({
    isLoading: false,
    isdisabled: false,
  });
  const [error, setError] = useLegacyState({
    isAlertShown: false,
    message: "",
  });
  const [formData, setFormData] = useLegacyState({
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
      dispatch(fetchUserById(user.uid));
    });
    return unsubscribe;
  }, [dispatch, navigate]);

  useEffect(() => {
    if (username) {
      navigate("/");
    }
  }, [navigate, username]);

  console.log({ uid });

  const handleFileInput = async (e) => {
    if (e.target.files[0]?.size > MAX_AVATAR_SIZE) {
      setError({
        message: `File size should be less than ${MAX_AVATAR_SIZE / 1024} KB`,
      });
      return;
    }
    await storeFileToFirebase(e, uid);
  };

  const storeFileToFirebase = async (e, uid) => {
    setButton({ isDisabled: true });
    const avatarRef = storage.ref(`avatar/${uid}/${Date.now()}`);
    await avatarRef.put(e.target.files[0]);
    await avatarRef
      .getDownloadURL()
      .then((url) => setFormData((state) => ({ ...state, avatar: url })));
    setButton({ isDisabled: false });
  };

  const handleInput = async (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity() === false) {
      setValidate(true);
      return;
    }
    setButton({ isLoading: true, isDisabled: true });
    const response = await dispatch(signupComplete({ uid, formData }));
    if (response.error) {
      setError({ isAlertShown: true, message: response.error.message });
      setButton({ isLoading: false, isDisabled: false });
      return;
    }
    navigate("/");
  };

  return (
    <>
      <Navigation />
      <Container className={styles.container}>
        <Row>
          <Col>
            <h2 className={styles.heading}>Create your account</h2>
            {error.isAlertShown && (
              <Alert
                variant="danger"
                onClose={() => setError({ isAlertShown: false, message: "" })}
                dismissible>
                {error.message}
              </Alert>
            )}
            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
              <DisplayName name={formData.name} onInput={handleInput} />
              <Username username={formData.username} onInput={handleInput} />
              <UserAvatar onInput={handleFileInput} />
              <UserBio bio={formData.bio} onInput={handleInput} />
              <FormButton
                disabled={button.isDisabled}
                loading={button.isLoading}
                text="Sign up"
              />
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignupComplete;
