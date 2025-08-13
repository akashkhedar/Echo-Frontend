import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar, Badge } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useConversationList from "../../hooks/useConversationList";
import useUser from "../../hooks/useUser";
import UploadPost from "../uploadPost/UploadPost";

export default function FixedBottomNavigation() {
  const { data: user } = useUser();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const { data: conversations = [] } = useConversationList(user._id);
  const hasUnread = conversations.some((c) => c.unread);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const navigate = useNavigate();

  const getIconColor = (index) => (value === index ? "#a259ff" : "#b0b0b0");

  const location = useLocation();

  const paths = ["/", "/chat", "/upload", "/profile/about"]; // Match the order of your icons

  // Set value based on current path
  useEffect(() => {
    const index = paths.indexOf(location.pathname);
    if (index !== -1) setValue(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      elevation={5}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{ bgcolor: "#1e1e2f" }}
      >
        <BottomNavigationAction
          onClick={() => navigate("/")}
          icon={<HomeIcon sx={{ color: getIconColor(0) }} />}
        />
        <BottomNavigationAction
          onClick={() => navigate("/chat")}
          icon={
            <>
              <Badge color={hasUnread ? "error" : "default"} variant="dot" />
              <ForumRoundedIcon sx={{ color: getIconColor(1) }} />
            </>
          }
        />
        <BottomNavigationAction
          onClick={handleOpen}
          icon={<AddBoxOutlinedIcon sx={{ color: getIconColor(2) }} />}
        />
        <BottomNavigationAction
          onClick={() => navigate("/profile/about")}
          icon={
            <Avatar
              alt="User Avatar"
              src={user.profileImage}
              sx={{
                width: { xs: 30, sm: 36, md: 38, lg: 40 },
                height: { xs: 30, sm: 36, md: 38, lg: 40 },
                border: "2px solid #d900ff",
              }}
            />
          }
        />
      </BottomNavigation>
      <UploadPost open={open} handleClose={handleClose} />
    </Paper>
  );
}
