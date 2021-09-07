import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import styles from "./SocialIcons.module.css";

const SocialIcons = () => {
  return (
    <ul className={styles.iconContainer}>
      <li>
        <a
          className={`link ${styles.iconLink}`}
          target="_blank"
          rel="noreferrer"
          href="https://github.com/tuhindas30/rabibook">
          <FaGithub />
        </a>
      </li>
      <li>
        <a
          className={`link ${styles.iconLink}`}
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/tuhindas30">
          <FaTwitter />
        </a>
      </li>
      <li>
        <a
          className={`link ${styles.iconLink}`}
          target="_blank"
          rel="noreferrer"
          href="https://linkedin.com/in/tuhindas30">
          <FaLinkedin />
        </a>
      </li>
    </ul>
  );
};

export default SocialIcons;
