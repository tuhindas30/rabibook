import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Navigation } from "../../components";
import { signin } from "./authSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import styles from "./Login.module.css";

const Login = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setAlertDisplay(false);
    const response = await dispatch(
      signin({ email: formData.email, password: formData.password })
    );
    if (!response.error) {
      return navigate("/");
    }
    setErrorMsg(response.error.message);
    return setAlertDisplay(true);
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
              <Button type="submit" className={`button ${styles.button}`}>
                Log in
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
