import { Box, Grid, Skeleton } from "@mui/material";

const LoadingFriends = () => {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#070022ff",
              borderRadius: 3,
              padding: 2,
              height: 80,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="circular" width={50} height={50} />
              <Box>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={15} />
              </Box>
            </Box>
            <Skeleton variant="rounded" width={40} height={40} />
          </Box>
        </Grid>
      ))}
    </>
  );
};

export default LoadingFriends;
