import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { SocialIcons } from "../../components";
import styles from "./Home.module.css";
import Hero from "./Hero.webp";

const Home = () => {
  const navigate = useNavigate();

  useDocumentTitle("RabiBook | Home");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        return navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <Container fluid>
      <Row className={styles.container}>
        <Col md className={styles.headerItem}>
          <h1 className={styles.brandName}>RabiBook</h1>
          <p className={styles.tagline}>
            Share your insights on Tagore poems, novels, songs and books.
          </p>
          <h3 className={styles.signupText}>Join RabiBook today</h3>
          <Link to="/signup" className={styles.buttonLink}>
            <Button block className={`button ${styles.button}`}>
              Sign up
            </Button>
          </Link>
          <Link to="/login" className={styles.buttonLink}>
            <Button
              variant="outline-primary"
              block
              className={`outline ${styles.button}`}>
              Log in
            </Button>
          </Link>
        </Col>
        <Col md className={styles.imageContainer}>
          <Image src={Hero} rounded />
        </Col>
      </Row>
      <Row className={styles.footer}>
        <Col>
          <div className={styles.footerHeading}>RabiBook v0.1</div>
          <SocialIcons />
          <div className={styles.credit}>
            Made with ❤️ by{" "}
            <a
              href="https://tuhindas.me"
              target="_blank"
              rel="noreferrer"
              className={styles.creator}>
              Tuhin Das
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
