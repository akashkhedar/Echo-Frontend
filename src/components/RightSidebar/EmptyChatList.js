import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Typography } from "@mui/material";

const EmptyChatList = () => {
  return (
    <Box
      sx={{
        bgcolor: "#121212",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ccc",
        p: 1.5,
        mx: 1,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <ChatOutlinedIcon sx={{ fontSize: 28, color: "#666", mb: 0.5 }} />
        <Typography
          variant="body1"
          fontWeight={500}
          sx={{ fontSize: "0.9rem" }}
        >
          Quick Chat Empty
        </Typography>
        <Typography variant="caption" color="#888" display="block">
          Start a conversation
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyChatList;
