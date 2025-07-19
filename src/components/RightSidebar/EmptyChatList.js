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
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" fontWeight={500}>
          Quick chat empty
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyChatList;
