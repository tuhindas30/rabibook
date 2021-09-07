import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Image, Row } from "react-bootstrap";
import { auth } from "../../firebase";
import { BsCalendar } from "react-icons/bs";
import { CommentModal, PostCard } from "../../components";
import { sendBtnClicked, deleteBtnClicked } from "../profile/profileSlice";
import { commentPost, deleteComment } from "../comments/commentSlice";
import { fetchUserById } from "../auth/authSlice";
import { loadPosts } from "../feed/feedSlice";
import { dateToMonYYYY } from "../../helpers/date";
import * as profileSlice from "./profileSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Wrapper from "../../layouts/Wrapper";
import Error404 from "../error/Error404";
import { ReactComponent as Loader } from "../../assets/images/Loader.svg";
import styles from "./Profile.module.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const authUser = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile);
  const [isModalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState({
    postId: "",
    uid: "",
    data: null,
  });
  const {
    deletePostBtnClicked,
    deletePostFromProfile,
    fetchUserByUsername,
    followProfile,
    likeBtnClicked,
    removeLikeBtnClicked,
    unFollowProfile,
  } = profileSlice;
  const isProfileFollowing = authUser.following?.includes(profile.uid);
  const [isFollowing, setFollowing] = useState(false);
  const documentTitle =
    profile.displayName && profile.username
      ? `${profile.displayName} (@${profile.username}) / RabiBook`
      : "RabiBook";
  const coverPhotoURL = profile.coverPhoto
    ? profile.coverPhoto
    : `https://cdn.statically.io/og/theme=dark/${
        profile.displayName || "Cover Photo"
      }.jpg`;

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
    setFollowing(isProfileFollowing);
  }, [dispatch, fetchUserByUsername, username, isProfileFollowing]);

  const handleDelete = (postId) => {
    dispatch(
      deletePostFromProfile({
        postId,
        uid: authUser.uid,
        following: authUser.following,
      })
    );
    dispatch(deletePostBtnClicked({ postId }));
  };

  const handleLikeBtn = async (postId) => {
    dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
    dispatch(likeBtnClicked({ postId }));
  };

  const handleRemoveLikeBtn = async (postId) => {
    dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
    dispatch(removeLikeBtnClicked({ postId }));
  };

  const handleCommentBtn = (postId, uid, data) => {
    setModalShown(true);
    setModalData({ postId, uid, data });
  };

  const handleSendComment = async (postId, commentData) => {
    const response = await dispatch(commentPost({ postId, commentData }));
    if (response.error) return;
    dispatch(sendBtnClicked({ postId }));
    dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
  };

  const handleDeleteComment = async (postId, commentId) => {
    const response = await dispatch(deleteComment({ postId, commentId }));
    if (response.error) return;
    dispatch(deleteBtnClicked({ postId }));
    dispatch(loadPosts({ uid: authUser.uid, following: authUser.following }));
  };

  const toggleFollowBtn = async (uid, isFollowing) => {
    const profileData = {
      uid: profile.uid,
      displayName: profile.displayName,
      username: profile.username,
      avatar: profile.avatar,
      bio: profile.bio,
    };
    if (isFollowing) {
      setFollowing(false);
      return dispatch(
        unFollowProfile({
          uid,
          following: authUser.following.filter(
            (profileId) => profileId !== profile.uid
          ),
          profileId: profileData.uid,
        })
      );
    }
    setFollowing(true);
    return dispatch(
      followProfile({
        uid,
        following: [...authUser.following, profile.uid],
        profileData,
      })
    );
  };

  if (authUser.status === "loading" || profile.userStatus === "loading") {
    return (
      <Wrapper>
        <div className="overlay">
          <Loader />
        </div>
      </Wrapper>
    );
  }

  if (profile.userStatus === "error") {
    return <Error404 />;
  }

  return (
    <Wrapper>
      <Row className={styles.coverPhotoContainer}>
        <Image src={coverPhotoURL} className={styles.coverPhoto} />
      </Row>
      <Image src={profile.avatar} className={styles.avatar} roundedCircle />
      <Row className={styles.profileInfo}>
        <Col>
          <div className={styles.displayName}>{profile.displayName}</div>
          <div className={styles.username}>@{profile.username}</div>
        </Col>
        {authUser.uid !== profile.uid && (
          <Col className={styles.followButton}>
            <Button
              onClick={() => toggleFollowBtn(authUser.uid, isFollowing)}
              className={isFollowing ? "outline" : "button"}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Col>
        )}
      </Row>
      <Row className={styles.bio}>
        <Col>{profile.bio}</Col>
      </Row>
      <Row>
        {authUser.uid === profile.uid && (
          <Col className={styles.joinedOn}>
            <BsCalendar className={styles.calendarIcon} />
            Joined {dateToMonYYYY(profile.joinedOn)}
          </Col>
        )}
      </Row>
      <Row className={styles.following}>
        <Col>
          <Link
            to={`/${profile.username}/following`}
            className={styles.followingLink}>
            {profile.followings?.length || 0} Following
          </Link>
        </Col>
      </Row>
      <h5 className={styles.title}>Posts</h5>
      {profile.postStatus === "loading" && (
        <div className={styles.message}>Loading ...</div>
      )}
      {profile.postStatus === "error" && (
        <div className={styles.message}>Cannot load posts. Try again.</div>
      )}
      {profile.postStatus === "fulfilled" && (
        <div className={styles.postsContainer}>
          {profile.posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              onLike={handleLikeBtn}
              onRemoveLike={handleRemoveLikeBtn}
              onDelete={handleDelete}
              onComment={handleCommentBtn}
            />
          ))}
        </div>
      )}
      <CommentModal
        isModalShown={isModalShown}
        modalData={modalData}
        onHide={setModalShown}
        onSend={handleSendComment}
        onDelete={handleDeleteComment}
      />
    </Wrapper>
  );
};

export default Profile;
