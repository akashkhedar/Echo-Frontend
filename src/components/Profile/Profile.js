import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import About from "./About";
import Connections from "./Connections";
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
        overflowY: "auto",
        pt: 1,
        marginTop: -0.6,
      }}
    >
      <ProfileHeader />

      <Sections />
      {currentPath === "/profile/about" ? (
        <About />
      ) : currentPath === "/profile/following" ? (
        <Connections path={"/profile/following"} />
      ) : currentPath === "/profile/followers" ? (
        <Connections path={"/profile/followers"} />
      ) : (
        <PostMade />
      )}
    </Box>
  );
};

export default Profile;
