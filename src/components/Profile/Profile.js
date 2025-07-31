import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import About from "./About";
import FriendsPage from "./FriendsPage";
import PostMade from "./PostMade";
import ProfileHeader from "./ProfileHeader";
import Sections from "./Sections";

const Profile = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        background: "#121212",
        marginTop: -0.6,
      }}
    >
      <Box width={"97%"}>
        <ProfileHeader />
        <Sections />

        {currentPath === "/profile/about" ? (
          <About />
        ) : currentPath === "/profile/following" ? (
          <FriendsPage path={"/profile/following"} />
        ) : currentPath === "/profile/followers" ? (
          <FriendsPage path={"/profile/followers"} />
        ) : (
          <PostMade />
        )}
      </Box>
    </Box>
  );
};

export default Profile;
