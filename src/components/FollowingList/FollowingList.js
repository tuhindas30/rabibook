import React from "react";
import { Button, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  unFollowBtnClicked,
  unFollowProfile,
} from "../../features/profile/profileSlice";
import styles from "./FollowingList.module.css";

const FollowingList = ({ profile }) => {
  const authUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleUnFollowBtn = async (uid, profileId) => {
    const response = await dispatch(
      unFollowProfile({
        uid,
        following: authUser.following.filter((profId) => profId !== profileId),
        profileId,
      })
    );
    if (response.error) return;
    dispatch(unFollowBtnClicked({ profileId }));
  };

  return (
    <ListGroup.Item>
      <Row>
        <Link to={`/${profile.username}`}>
          <Col xs={2}>
            <Image
              src={profile.avatar}
              className={styles.avatar}
              roundedCircle
            />
          </Col>
        </Link>
        <Col>
          <Row>
            <Link to={`/${profile.username}`}>
              <Col>
                <div className={styles.displayName}>{profile.displayName}</div>
                <div className={styles.username}>@{profile.username}</div>
              </Col>
            </Link>
            {authUser.uid !== profile.uid && (
              <Col className={styles.unFollowButtonContainer}>
                <Button
                  onClick={() => handleUnFollowBtn(authUser.uid, profile.uid)}
                  className={`outline ${styles.unFollowButton}`}>
                  Unfollow
                </Button>
              </Col>
            )}
          </Row>
          <Link to={`/${profile.username}`}>
            <Row>
              <Col>{profile.bio}</Col>
            </Row>
          </Link>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default FollowingList;
