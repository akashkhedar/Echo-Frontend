import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./components/ChatPage/Chat";
import HomeLayout from "./components/HomeLayout";
import LogInPage from "./components/Login/Login";
import Post from "./components/PostPage/Post";
import Profile from "./components/Profile/Profile";
import SignupPage from "./components/Signup/Signup";
import VideoCallPage from "./components/Calling/VideoCallPage";
import ForgetPassword from "./components/ChangePassword/ForgetPassword";
import UpdatePassword from "./components/ChangePassword/UpdatePassword";
import ValidateToken from "./components/ChangePassword/ValidateToken";
import { SnackbarProvider } from "notistack";

function App() {
  // Somewhere in App.js or a `useEffect` at the root level
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "persist:root") {
        const newState = JSON.parse(e.newValue || "{}");
        const oldUser = JSON.parse(localStorage.getItem("persist:root"))?.user;
        const newUser = newState?.user;

        if (oldUser !== newUser) {
          window.location.reload(); // or trigger logout
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/validate/:token" element={<ValidateToken />} />
          <Route path="/update-password/:token" element={<UpdatePassword />} />
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
          <Route path="/call" element={<VideoCallPage />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
