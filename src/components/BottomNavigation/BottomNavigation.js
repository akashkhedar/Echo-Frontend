import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import HomeIcon from "@mui/icons-material/Home";
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded";
import { Badge } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useConversationList from "../../hooks/useConversationList";
import UploadPost from "../uploadPost/UploadPost";
import useUser from "../../hooks/useUser";

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
          onClick={() => {
            navigate("/");
          }}
          icon={<HomeIcon sx={{ color: getIconColor(0) }} />}
        />
        <BottomNavigationAction
          onClick={() => {
            navigate("/chat");
          }}
          icon={
            <>
              <Badge
                color={hasUnread ? "error" : "default"}
                variant="dot"
              ></Badge>
              <ForumRoundedIcon sx={{ color: getIconColor(1) }} />
            </>
          }
        />
        <BottomNavigationAction
          onClick={handleOpen}
          icon={<AddBoxOutlinedIcon sx={{ color: getIconColor(2) }} />}
        />
        <BottomNavigationAction
          onClick={() => {
            navigate("/profile/about");
          }}
          icon={<TheaterComedyRoundedIcon sx={{ color: getIconColor(3) }} />}
        />
      </BottomNavigation>
      <UploadPost open={open} handleClose={handleClose} />
    </Paper>
  );
}
