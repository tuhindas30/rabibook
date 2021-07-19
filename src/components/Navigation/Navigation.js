import { Button, Container, Navbar } from "react-bootstrap";
import styles from "./Navigation.module.css";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

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
    <Navbar fixed="top" className={styles.navbar}>
      <Container className={styles.container}>
        <Link to="/">
          <Navbar.Brand className={styles.brandName}>RabiBook</Navbar.Brand>
        </Link>
        {authUser.uid && (
          <Button
            onClick={handleLogoutBtn}
            className={`outline ${styles.btnSmall}`}>
            Log out
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Navigation;
