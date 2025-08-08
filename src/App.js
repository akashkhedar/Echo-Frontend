import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import VideoCallPage from "./components/Calling/VideoCallPage";
import ForgetPassword from "./components/ChangePassword/ForgetPassword";
import UpdatePassword from "./components/ChangePassword/UpdatePassword";
import ValidateToken from "./components/ChangePassword/ValidateToken";
import Chat from "./components/ChatPage/Chat";
import HomeLayout from "./components/HomeLayout";
import LogInPage from "./components/Login/Login";
import Post from "./components/PostPage/Post";
import Profile from "./components/Profile/Profile";
import SignupPage from "./components/Signup/Signup";
import socket from "./utils/socket";

function App() {
  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    socket.emit("online", userId);

    const handleBeforeUnload = () => {
      socket.emit("offline", userId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("offline");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  // Somewhere in App.js or a `useEffect` at the root level
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "persist:auth") {
        const newAuth = JSON.parse(e.newValue || "{}");
        const oldAuth = JSON.parse(
          localStorage.getItem("persist:auth") || "{}"
        );

        if (oldAuth?.userId !== newAuth?.userId) {
          window.location.reload(); // or dispatch logout
          return () =>
            window.removeEventListener("storage", handleStorageChange);
        }
      }
    };
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
