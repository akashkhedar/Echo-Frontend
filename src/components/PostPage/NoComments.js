import { Box, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const NoComments = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={4}
      gap={1}
      color="text.secondary"
      bgcolor="#11111b"
    >
      <Box
        sx={{
          bgcolor: "black",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          borderRadius: "0.5rem",
          p: 2,
          gap: 1,
        }}
      >
        <ChatBubbleOutlineIcon fontSize="large" sx={{ color: "#d900ffff" }} />
        <Typography variant="body1" fontWeight={500}>
          No comments yet
        </Typography>
        <Typography variant="body2">
          Be the first to share your thoughts!
        </Typography>
      </Box>
    </Box>
  );
};

export default NoComments;
