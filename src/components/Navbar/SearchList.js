import { Avatar, Box, IconButton, Typography } from "@mui/material";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";

const SearchList = ({ user, handleMessage, handleFollow }) => {
  const follower = useSelector((state) => state.user.follower);
  return (
    <Box
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
        <IconButton onClick={() => handleMessage(user._id)}>
          <SendIcon sx={{ color: "whitesmoke" }} />
        </IconButton>
        {follower.includes(user._id) ? (
          <IconButton onClick={() => handleFollow(user._id)}>
            <PersonRemoveAlt1Icon sx={{ color: "red" }} />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleFollow(user._id)}>
            <PersonAddAlt1Icon sx={{ color: "green" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default SearchList;
