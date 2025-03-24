import { Box, Skeleton } from "@mui/material";

const NavbarSkeleton = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "3.6rem", sm: "3.6rem", md: "3.7rem" },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundImage: "linear-gradient(#1E1E2F, #121212)",
      }}
    >
      {/* Logo Skeleton */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 0.5,
        }}
      >
        <Skeleton variant="circular" width={37} height={37} />
        <Skeleton
          variant="rounded"
          width={110}
          height={40}
          sx={{ borderRadius: 3 }}
        />
      </Box>

      {/* Search Bar Skeleton */}
      <Skeleton
        variant="rounded"
        width={700}
        height={40}
        sx={{ borderRadius: 5 }}
      />

      {/* Icons/Menu Items Skeleton */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </Box>
  );
};

export default NavbarSkeleton;
