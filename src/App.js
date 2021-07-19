import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import Home from "./features/auth/Home";
import Feed from "./features/feed/Feed";
import Profile from "./features/profile/Profile";
import Settings from "./features/profile/Settings";
import Post from "./features/post/Post";
import Error404 from "./features/error/Error404";
import Following from "./features/profile/Following";
import Wrapper from "./layouts/Wrapper";
import SignupComplete from "./features/auth/SignupComplete";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Wrapper children={<Feed />} />} />
        <Route path="/:username" element={<Profile />} />
        <Route path="/:username/following" element={<Following />} />
        <Route path="/post/:postId" element={<Wrapper children={<Post />} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-complete" element={<SignupComplete />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile/settings"
          element={<Wrapper children={<Settings />} />}
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
};

export default App;
