import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ReactComponent as Error404Fig } from "./Error404.svg";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import styles from "./Error404.module.css";

const Error404 = () => {
  useDocumentTitle("Not Found 404 | RabiBook");

  return (
    <div className={styles.errorMsgContainer}>
      <Error404Fig className={styles.image} />
      <div className={styles.errorMsg}>
        <div className={styles.errorMsgBold}>YOU SEEM LOST</div>
        <div className={styles.errorMsgTakeHome}>
          That's okay, we know the way to home.
        </div>
      </div>
      <Link to="/">
        <Button className="button">TAKE ME HOME</Button>
      </Link>
    </div>
  );
};
export default Error404;
