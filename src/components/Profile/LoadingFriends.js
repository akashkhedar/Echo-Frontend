import React from "react";
import { Skeleton, Box, Grid } from "@mui/material";

const LoadingFriends = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Grid item xs={3} sm={4} md={4} key={i}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2a2a40",
              borderRadius: 2,
              padding: 2,
              gap: 1,
            }}
          >
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="rounded" width={130} height={20} />
          </Box>
        </Grid>
      ))}
    </>
  );
};

export default LoadingFriends;
