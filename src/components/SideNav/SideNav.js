import { useSelector } from "react-redux";
import { Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { RiHomeHeartFill, RiSettings2Fill } from "react-icons/ri";
import styles from "./SideNav.module.css";

const SideNav = () => {
  const { displayName, username, avatar } = useSelector((state) => state.auth);
  return (
    <Navbar className={styles.sideNav}>
      <Container className={styles.pillsContainer}>
        <Nav className={styles.navPills}>
          <NavLink
            to="/"
            className={styles.navLink}
            activeClassName={styles.active}
            end>
            <RiHomeHeartFill className={styles.iconMargin} />
            Home
          </NavLink>
          <NavLink
            to="/profile/settings"
            className={styles.navLink}
            activeClassName={styles.active}
            end>
            <RiSettings2Fill className={styles.iconMargin} />
            Settings
          </NavLink>
        </Nav>
        <Nav>
          <NavLink to={`/${username}`} className={styles.navLink}>
            <Row>
              <Col md={3} style={{ marginRight: "0.5rem" }}>
                {avatar ? (
                  <Image src={avatar} className={styles.avatar} roundedCircle />
                ) : (
                  <FaUserCircle className={styles.iconMargin} />
                )}
              </Col>
              <Col className={styles.profile}>
                <Row className={styles.displayName}>
                  <Col>{displayName}</Col>
                </Row>
                <Row className={styles.username}>
                  <Col>@{username}</Col>
                </Row>
              </Col>
            </Row>
          </NavLink>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default SideNav;
