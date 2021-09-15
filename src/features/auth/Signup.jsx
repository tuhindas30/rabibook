import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { signup } from "./authSlice";
import {
  FormButton,
  Navigation,
  UserEmail,
  UserPassword,
} from "../../components";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import { useLegacyState, useDocumentTitle } from "../../hooks";
import styles from "./Signup.module.css";

const Signup = () => {
  const dispatch = useDispatch();
  const [isValidated, setValidate] = useState(false);
  const [error, setError] = useLegacyState({
    isAlertShown: false,
    message: "",
  });
  const [button, setButton] = useLegacyState({
    isLoading: false,
    isDisabled: false,
  });
  const [formData, setFormData] = useLegacyState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useDocumentTitle("Create your account on RabiBook");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigate("/signup-complete");
        return;
      }
    });
    return unsubscribe;
  }, []);

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
    setButton({ isLoading: true, isDisabled: true });
    const response = await dispatch(signup(formData));
    if (response.error) {
      setError({ isAlertShown: true, message: response.error.message });
      setButton({ isLoading: false, isDisabled: false });
    }
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
                onClose={() => setError({ alert: false, message: "" })}
                dismissible>
                {error.message}
              </Alert>
            )}
            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
              <UserEmail email={formData.email} onInput={handleInput} />
              <UserPassword
                password={formData.password}
                onInput={handleInput}
              />
              <FormButton
                disabled={button.isDisabled}
                loading={button.isLoading}
                text="Next"
              />
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
