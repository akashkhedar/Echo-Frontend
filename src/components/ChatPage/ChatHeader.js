import { Phone, Videocam } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectChatUser } from "../../redux/selectors/statusSelector";
import socket from "../../utils/socket";

const ChatHeader = () => {
  const user = useSelector(selectChatUser);
  let callerId = useSelector((state) => state.user._id);
  let calleeId = user._id;

  const handleVideoCall = async () => {
    socket.emit("callUser", { callerId, calleeId, type: "video" });
    console.log(socket.id);
  };

  const handleVoiceCall = async () => {
    socket.emit("callUser", { callerId, calleeId, type: "audio" });
  };

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

      {/* Action Buttons */}
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
    </Box>
  );
};

export default ChatHeader;
