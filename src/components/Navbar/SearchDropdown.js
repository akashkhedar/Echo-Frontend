import { Box, Typography } from "@mui/material";
import axiosInstance from "../../axiosInstance";
import socket from "../../utils/socket";
import SearchList from "./SearchList";

const SearchDropdown = ({ results, isOpen, userId }) => {
  if (!isOpen) return null;

  const handleFollow = async (id) => {
    try {
      await axiosInstance.put(`/user/follow/${id}`);
    } catch (error) {}
  };

  const handleUnfollow = async (id) => {
    try {
      await axiosInstance.put(`/user/unfollow/${id}`);
    } catch (error) {}
  };

  const handleMessage = (id) => {
    socket.emit("redirectConvo", {
      sender: userId,
      receiver: id,
    });
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "3.5rem", // adjust based on your navbar height
        left: "50%",
        transform: "translateX(-43.5%)",
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
          <SearchList
            user={user}
            handleFollow={handleFollow}
            handleMessage={handleMessage}
          />
        ))
      )}
    </Box>
  );
};

export default SearchDropdown;
