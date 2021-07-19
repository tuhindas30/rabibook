import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Navigation } from "../../components";
import { signup } from "./authSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import styles from "./Signup.module.css";

const Signup = () => {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(true);
  const [alertDisplay, setAlertDisplay] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useDocumentTitle("Create your account on RabiBook");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        return navigate("/signup-complete");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleInput = (e) => {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setAlertDisplay(false);
    const response = await dispatch(
      signup({ email: formData.email, password: formData.password })
    );
    if (response.error) {
      setErrorMsg(response.error.message);
      setAlertDisplay(true);
    }
    return setDisabled(false);
  };

  const handlePassword = (e) => {
    handleInput(e);
    if (e.target.value.length >= 8) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
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
            <h2 className={styles.heading}>Create your account</h2>
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
                  value={formData.email}
                  onChange={handleInput}
                  required
                />
                <Form.Control.Feedback type={"invalid"}>
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handlePassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formData.password.length < 8 &&
                    "Password should be greater than 8 characters."}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                type="submit"
                className={`button ${styles.button} ${
                  isDisabled ? "not-allowed" : "pointer"
                }`}
                disabled={isDisabled}>
                Next
              </Button>
            </Form>
            <Link to="/login" className={styles.signupLink}>
              Log in to RabiBook
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;
