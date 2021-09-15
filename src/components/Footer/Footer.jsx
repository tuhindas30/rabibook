import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Col, Image, Row } from "react-bootstrap";
import { RiHomeHeartFill, RiSettings2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  const { username, avatar } = useSelector((state) => state.auth);

  return (
    <Row className={styles.footer}>
      <Col className={styles.footerItem}>
        <NavLink
          to="/"
          className={styles.footerLink}
          activeClassName={styles.active}
          end>
          <RiHomeHeartFill />
        </NavLink>
      </Col>
      <Col className={styles.footerItem}>
        <NavLink
          to={`/${username}`}
          className={styles.footerLink}
          activeClassName={styles.active}
          end>
          {avatar ? (
            <Image src={avatar} className={styles.avatar} roundedCircle />
          ) : (
            <FaUserCircle />
          )}
        </NavLink>
      </Col>
      <Col className={styles.footerItem}>
        <NavLink
          to="/profile/settings"
          className={styles.footerLink}
          activeClassName={styles.active}
          end>
          <RiSettings2Fill />
        </NavLink>
      </Col>
    </Row>
  );
};

export default Footer;
