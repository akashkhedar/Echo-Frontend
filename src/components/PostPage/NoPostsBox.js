import { Box, Typography } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const NoPostsBox = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vh",
        bgcolor: "#121212",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#ccc",
      }}
    >
      <HourglassEmptyIcon sx={{ fontSize: 60, color: "#888", mb: 1 }} />
      <Typography variant="h6" fontWeight={500}>
        No posts to show
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "#888" }}>
        Stay tuned for new updates!
      </Typography>
    </Box>
  );
};

export default NoPostsBox;
