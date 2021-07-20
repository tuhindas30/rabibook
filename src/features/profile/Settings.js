import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase";
import { UpdateProfileForm } from "../../components";
import { fetchUserById, updateUser } from "../auth/authSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Settings = () => {
  const authUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const documentTitle =
    authUser.displayName && authUser.username
      ? `${authUser.displayName} (@${authUser.username}) / RabiBook`
      : "RabiBook";

  useDocumentTitle(documentTitle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        return navigate("/home");
      }
      const { uid } = user;
      if (authUser.status === "idle") {
        dispatch(fetchUserById(uid));
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate, authUser.status]);

  const handleUpdateUser = (uid, formDataObj) => {
    dispatch(updateUser({ uid, formDataObj }));
  };

  if (authUser.status === "loading") {
    return <h1 className="overlay">Loading ...</h1>;
  }

  return <UpdateProfileForm onUpdate={handleUpdateUser} />;
};

export default Settings;
