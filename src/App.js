import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
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
import useUser from "./hooks/useUser";
import socket from "./utils/socket";

function App() {
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    console.log(user);
    if (!user) return;
    socket.emit("online", user._id);

    const handleBeforeUnload = () => {
      socket.emit("offline", user._id);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("offline");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  if (isLoading) {
    return;
  }

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
