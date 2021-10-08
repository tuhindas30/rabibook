import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  FormButton,
  Navigation,
  UserEmail,
  UserPassword,
} from "../../components";
import { signin } from "./authSlice";
import { useDocumentTitle, useLegacyState } from "../../hooks";
import { ReactComponent as Loader } from "../../assets/images/Loader.svg";
import styles from "./Login.module.css";

const Login = () => {
  const [isValidate, setValidate] = useState(false);
  const [error, setError] = useLegacyState({
    isAlertShown: false,
    message: "",
  });
  const [userButton, setUserButton] = useLegacyState({
    isLoading: false,
    isDisabled: false,
  });
  const [guestButton, setGuestButton] = useLegacyState({
    isLoading: false,
    isDisabled: false,
  });
  const [formData, setFormData] = useLegacyState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useDocumentTitle("Login to RabiBook");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
        return;
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleInput = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.checkValidity() === false) {
      setValidate(true);
      return;
    }
    setUserButton({ isLoading: true, isDisabled: true });
    const response = await dispatch(signin(formData));
    if (response.error) {
      setError({ isAlertShown: true, message: response.error.message });
      setUserButton({ isLoading: false, isDisabled: false });
      return;
    }
    navigate("/");
  };

  const handleGuestLogin = async () => {
    const credentials = {
      email: process.env.REACT_APP_TEST_USER,
      password: process.env.REACT_APP_TEST_PASSWORD,
    };
    setGuestButton({ isLoading: true, isDisabled: true });
    const response = await dispatch(signin(credentials));
    if (response.error) {
      setError({ isAlertShown: true, message: response.error.message });
      setGuestButton({ isLoading: false, isDisabled: false });
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
            <h2 className={styles.heading}>Log in to RabiBook</h2>
            {error.isAlertShown && (
              <Alert
                variant="danger"
                onClose={() => setError({ isAlertShown: false, message: "" })}
                dismissible>
                {error.message}
              </Alert>
            )}
            <Form noValidate validated={isValidate} onSubmit={handleSubmit}>
              <UserEmail email={formData.email} onInput={handleInput} />
              <UserPassword
                password={formData.password}
                onInput={handleInput}
              />
              <FormButton
                disabled={userButton.isDisabled}
                loading={userButton.isLoading}
                text="Log in"
              />
              <Button
                onClick={handleGuestLogin}
                className={`button ${styles.button} ${
                  guestButton.isLoading ? "not-allowed" : "pointer"
                }`}
                disabled={guestButton.isDisabled}>
                {guestButton.isLoading ? (
                  <Loader width="1.5rem" height="1.5rem" />
                ) : (
                  "Log in as guest"
                )}
              </Button>
            </Form>
            <Link to="/signup" className={styles.signupLink}>
              Sign up for RabiBook
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
