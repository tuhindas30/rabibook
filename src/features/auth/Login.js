import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Navigation } from "../../components";
import { signin } from "./authSlice";
import { useDocumentTitle, useLegacyState } from "../../hooks";
import { ReactComponent as Loader } from "../../assets/images/Loader.svg";
import styles from "./Login.module.css";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [isLoading, setLoading] = useLegacyState({ user: false, guest: false });
  const [credentials, setCredentials] = useLegacyState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useDocumentTitle("Login to RabiBook");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        return navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleInput = (e) => {
    setCredentials({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setAlertDisplay(false);
    setLoading({ user: true });
    const response = await dispatch(signin(credentials));
    if (!response.error) {
      return navigate("/");
    }
    setLoading({ user: false });
    setErrorMsg(response.error.message);
    return setAlertDisplay(true);
  };

  const handleGuestLogin = async () => {
    const credentials = {
      email: process.env.REACT_APP_TEST_USER,
      password: process.env.REACT_APP_TEST_PASSWORD,
    };
    setErrorMsg("");
    setAlertDisplay(false);
    setLoading({ guest: true });
    const response = await dispatch(signin(credentials));
    if (!response.error) {
      return navigate("/");
    }
    setLoading({ guest: false });
    setErrorMsg(response.error.message);
    setAlertDisplay(true);
  };

  const handleCloseAlert = () => {
    setErrorMsg("");
    setAlertDisplay(false);
  };

  return (
    <>
      <Navigation />
      <Container className={styles.container}>
        <Row>
          <Col>
            <h2 className={styles.heading}>Log in to RabiBook</h2>
            {alertDisplay && (
              <Alert variant="danger" onClose={handleCloseAlert} dismissible>
                {errorMsg}
              </Alert>
            )}
            <Form noValidate validated onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  onChange={handleInput}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  onChange={handleInput}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                type="submit"
                disabled={credentials.password.length < 6 || isLoading.user}
                className={`button ${styles.button} ${
                  isLoading.user ? "not-allowed" : "pointer"
                }`}>
                {isLoading.user ? (
                  <Loader width="1.5rem" height="1.5rem" />
                ) : (
                  "Log in"
                )}
              </Button>
              <Button
                onClick={handleGuestLogin}
                className={`button ${styles.button} ${
                  isLoading.guest ? "not-allowed" : "pointer"
                }`}
                disabled={isLoading.guest}>
                {isLoading.guest ? (
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
