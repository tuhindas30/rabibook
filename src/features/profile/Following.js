import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { ListGroup } from "react-bootstrap";
import { FollowingList } from "../../components";
import { fetchUserById } from "../auth/authSlice";
import { fetchUserByUsername } from "./profileSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Wrapper from "../../layouts/Wrapper";
import Error404 from "../error/Error404";
import { ReactComponent as Loader } from "../../assets/images/Loader.svg";
import styles from "./Following.module.css";

const Following = () => {
  const authUser = useSelector((state) => state.auth);
  const { userStatus, followingStatus, followings } = useSelector(
    (state) => state.profile
  );
  const dispatch = useDispatch();
  const { username } = useParams();

  const documentTitle = authUser.displayName
    ? `People followed by ${authUser.displayName}`
    : "RabiBook";

  useDocumentTitle(documentTitle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(fetchUserById(user.uid));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserByUsername(username));
  }, [dispatch, username]);

  if (authUser.status === "loading" || followingStatus === "loading") {
    return (
      <Wrapper>
        <div className="overlay">
          <Loader />
        </div>
      </Wrapper>
    );
  }

  if (userStatus === "error") {
    return <Error404 />;
  }

  return (
    <Wrapper>
      <div className={styles.follower}>
        <h4 className={styles.heading}>Following</h4>
        <ListGroup>
          {followings.map((profile) => (
            <FollowingList key={profile.uid} profile={profile} />
          ))}
        </ListGroup>
      </div>
    </Wrapper>
  );
};

export default Following;
