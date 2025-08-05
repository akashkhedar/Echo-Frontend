import { Phone, Videocam } from "@mui/icons-material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {
  Avatar,
  Box,
  createTheme,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import { clearChat } from "../../redux/slices/ChatSlice/ChatSlice";
import socket from "../../utils/socket";
import CallingModal from "./CallingModal";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 750,
      md: 900,
    },
  },
});

const ChatHeader = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(clearChat());
  };

  const user = useSelectedChatUser();
  console.log(user);
  const callerId = useSelector((state) => state.user?._id);
  const calleeId = user?._id;

  const handleVideoCall = async () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 30000);
    socket.emit("callUser", { callerId, calleeId, type: "video" });
  };

  const handleVoiceCall = async () => {
    socket.emit("callUser", { callerId, calleeId, type: "audio" });
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        padding: 1,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1E1E2F",
        color: "whitesmoke",
        height: "2.6rem",
      }}
    >
      {/* User Info */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isMobile && (
          <IconButton onClick={handleBack}>
            <ArrowBackIosRoundedIcon sx={{ color: "white", mr: 3, ml: -0.5 }} />
          </IconButton>
        )}

        <Avatar
          src={user.profileImage}
          alt={user.username}
          sx={{ border: "2px solid rgba(255, 255, 255, 0.1)" }}
        />
        <Box sx={{ marginLeft: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "whitesmoke" }}
          >
            {user.fullname}
          </Typography>
          {user.isOnline ? (
            <Typography variant="body2" sx={{ color: "rgb(82, 203, 71)" }}>
              Online
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: "rgb(92, 105, 91)" }}>
              Offline
            </Typography>
          )}
        </Box>
      </Box>

      <Box>
        <IconButton
          onClick={handleVideoCall}
          sx={{
            color: "whitesmoke",
          }}
        >
          <Videocam sx={{ fontSize: 30 }} />
        </IconButton>
        <IconButton
          onClick={handleVoiceCall}
          sx={{
            color: "whitesmoke",
          }}
        >
          <Phone sx={{ fontSize: 27 }} />
        </IconButton>
      </Box>
      <CallingModal
        open={open}
        onClose={handleClose}
        calleeImage={user.profileImage}
        callerId={callerId}
        calleeId={calleeId}
      />
    </Box>
  );
};

export default ChatHeader;
