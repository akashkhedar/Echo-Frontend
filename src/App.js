import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./components/ChatPage/Chat";
import HomeLayout from "./components/HomeLayout";
import LogInPage from "./components/Login/Login";
import Post from "./components/PostPage/Post";
import Profile from "./components/Profile/Profile";
import SignupPage from "./components/Signup/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route
          path="/"
          element={
            <HomeLayout>
              <Post />
            </HomeLayout>
          }
        />
        <Route
          path="/profile/about"
          element={
            <HomeLayout>
              <Profile />
            </HomeLayout>
          }
        />
        <Route
          path="/profile/followers"
          element={
            <HomeLayout>
              <Profile />
            </HomeLayout>
          }
        />
        <Route
          path="/profile/following"
          element={
            <HomeLayout>
              <Profile />
            </HomeLayout>
          }
        />
        <Route
          path="/profile/post"
          element={
            <HomeLayout>
              <Profile />
            </HomeLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <HomeLayout>
              <Chat />
            </HomeLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
