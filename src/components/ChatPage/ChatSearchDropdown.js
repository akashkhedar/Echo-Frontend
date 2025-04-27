import { Box, Typography, Avatar } from "@mui/material";
import socket from "../../utils/socket";

const ChatSearchDropdown = ({
  results,
  navigate,
  isOpen,
  selector,
  setOpenDropdown,
}) => {
  if (!isOpen) return null;

  const userId = selector((state) => state.user._id);

  return (
    <Box
      sx={{
        position: "absolute",
        top: "3.5rem", // adjust based on your navbar height
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "45rem",
        backgroundColor: "#121212",
        borderRadius: "10px",
        border: "1px solid #323232",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {results.length === 0 ? (
        <Typography p={2} textAlign="center" color="gray">
          No results found
        </Typography>
      ) : (
        results.map((user) => (
          <Box
            onClick={() => {
              socket.emit("redirectConvo", {
                sender: userId,
                receiver: user._id,
              });
              setOpenDropdown(false);
            }}
            key={user._id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderBottom: "1px solid #2a2a2a",
              "&:hover": { backgroundColor: "#1e1e1e", cursor: "pointer" },
            }}
          >
            <Avatar src={user.profileImage} alt={user.username} />
            <Box>
              <Typography color="whitesmoke">{user.username}</Typography>
              <Typography color="gray" fontSize="0.8rem">
                {user.fullname}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChatSearchDropdown;
