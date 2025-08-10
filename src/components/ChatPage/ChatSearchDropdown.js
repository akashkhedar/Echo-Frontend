import { Box, Typography, Avatar } from "@mui/material";
import socket from "../../utils/socket";
import useUser from "../../hooks/useUser";

const ChatSearchDropdown = ({
  results,
  navigate,
  isOpen,
  selector,
  setOpenDropdown,
}) => {
  const { data: user } = useUser();
  if (!isOpen) return null;

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
        results.map((res) => (
          <Box
            onClick={() => {
              socket.emit("redirectConvo", {
                sender: user._id,
                receiver: res._id,
              });
              setOpenDropdown(false);
            }}
            key={res._id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderBottom: "1px solid #2a2a2a",
              "&:hover": { backgroundColor: "#1e1e1e", cursor: "pointer" },
            }}
          >
            <Avatar src={res.profileImage} alt={res.username} />
            <Box>
              <Typography color="whitesmoke">{res.username}</Typography>
              <Typography color="gray" fontSize="0.8rem">
                {res.fullname}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ChatSearchDropdown;
