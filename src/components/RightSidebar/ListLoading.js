import { Box, Skeleton } from "@mui/material";
import React from "react";

const ListLoading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rounded" width={210} height={60} />
    </Box>
  );
};

export default ListLoading;
