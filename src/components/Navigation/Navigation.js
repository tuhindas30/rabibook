import { Button, Container, Navbar } from "react-bootstrap";
import styles from "./Navigation.module.css";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "..";

const Navigation = () => {
  const authUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutBtn = async () => {
    const response = await dispatch(signout());
    if (response.error) return;
    navigate("/home");
  };

  return (
    <Navbar fixed="top" className={styles.navbar} expand="lg">
      <Container fluid className={styles.container}>
        <Navbar.Brand className={styles.navbarBrand}>
          <Link to="/" className={styles.brandLink}>
            RabiBook
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse className={styles.navbarCollapse}>
          <Search />
          {authUser.uid && (
            <Button
              onClick={handleLogoutBtn}
              className={`outline ${styles.button}`}>
              Log out
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
