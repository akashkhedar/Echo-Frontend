import { Box, Typography } from "@mui/material";

const EmptyChatList = () => {
  return (
    <Box
      sx={{
        height: "100vh", // Full viewport height
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
            md: "50%",
          },
          maxWidth: "400px",
          borderRadius: 3,
          py: { xs: 3, sm: 4 },
          px: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#070022ff",
          color: "#fff",
          textAlign: "center",
          border: "2px solid rgba(56, 57, 56, 0.78)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="#d900ff"
          sx={{ fontSize: { xs: "1.1rem", sm: "1.4rem" } }}
        >
          No Chats
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.7,
            mt: 1,
            fontSize: { xs: "0.85rem", sm: "1rem" },
          }}
        >
          Start a new conversation
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyChatList;
