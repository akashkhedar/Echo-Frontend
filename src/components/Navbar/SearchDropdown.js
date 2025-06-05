import { Box, Typography, Avatar, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import axiosInstance from "../../axiosInstance";

const SearchDropdown = ({ results, navigate, isOpen }) => {
  if (!isOpen) return null;

  const handleFollow = async (id) => {
    try {
      await axiosInstance.put(`/user/follow/${id}`);
    } catch (error) {}
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
          <Box
            // onClick={() => {
            //   navigate(`/profile/${user.username}`);
            // }}
            key={user._id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              p: 1.5,
              borderBottom: "1px solid #2a2a2a",
              "&:hover": { backgroundColor: "#1e1e1e", cursor: "pointer" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
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
            <Box>
              <IconButton>
                <SendIcon sx={{ color: "whitesmoke" }} />
              </IconButton>
              <IconButton onClick={() => handleFollow(user._id)}>
                <PersonRemoveAlt1Icon sx={{ color: "whitesmoke" }} />
              </IconButton>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default SearchDropdown;
