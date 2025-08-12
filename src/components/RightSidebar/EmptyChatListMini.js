import { Box, Typography } from "@mui/material";

const EmptyChatListMini = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
        "&::-webkit-scrollbar": {
          display: "none",
        },

        // Hide scrollbar in Firefox
        scrollbarWidth: "none",

        // Hide scrollbar in IE/Edge
        msOverflowStyle: "none",
      }}
    >
      <Box
        sx={{
          width: "2px",
          height: "40px",
          bgcolor: "#666",
          mb: 0.5,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "#888",
          writingMode: "vertical-rl",
          textOrientation: "upright",
          fontSize: "0.65rem",
          letterSpacing: "1px",
        }}
      >
        No Quick Chat
      </Typography>
    </Box>
  );
};

export default EmptyChatListMini;
