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
    >
      <ChatBubbleOutlineIcon fontSize="large" />
      <Typography variant="body1" fontWeight={500}>
        No comments yet
      </Typography>
      <Typography variant="body2">
        Be the first to share your thoughts!
      </Typography>
    </Box>
  );
};

export default NoComments;
