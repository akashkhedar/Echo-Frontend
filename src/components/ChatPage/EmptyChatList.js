import { Box, Paper } from "@mui/material";

const EmptyChatList = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          px: 3,
          py: 2,
          textAlign: "center",
          color: "whitesmoke",
          fontWeight: "bold",
          backgroundColor: "rgb(58, 28, 66)",
          borderRadius: 2,
          opacity: 0.8,
        }}
      >
        <Box>No Chats</Box>
        <Box sx={{ fontSize: "0.9rem", fontWeight: "normal", mt: 1 }}>
          Start a new conversation
        </Box>
      </Paper>
    </Box>
  );
};

export default EmptyChatList;
