import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Typography } from "@mui/material";

const EmptyChatList = () => {
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#121212",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ccc",
        p: 2,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <ChatOutlinedIcon sx={{ fontSize: 40, color: "#555", mb: 1 }} />

        <Typography variant="h6" fontWeight={500}>
          Quick Chat Empty
        </Typography>
        <Typography variant="body2" color="#888" mt={1}>
          Start a conversation to see it here!
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyChatList;
