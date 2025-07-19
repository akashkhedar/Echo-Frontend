import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

const LoadingChats = () => {
  return (
    <Box
      sx={{
        p: 1,
        overflowY: "hidden",
        height: "100%",
      }}
    >
      <Stack spacing={1.5}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              padding: "8px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="rounded" width="60%" height={26} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default LoadingChats;
