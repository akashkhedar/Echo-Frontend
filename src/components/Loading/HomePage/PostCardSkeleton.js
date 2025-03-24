import { Box, Card, Skeleton } from "@mui/material";

const PostCardSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 4rem)",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        background: "#121212",
        marginTop: -0.6,
      }}
    >
      <Card
        sx={{
          width: {
            xs: "100%", // Full width on mobile
            sm: "92%", // Slightly reduced on small screens
            md: "67%", // Larger size on medium screens
            lg: "52%", // Instagram-like width for desktop
            xl: "40%", // Even more compact on extra-large screens
          },
          marginBottom: 2,
          background: "#1E1E2F",
          border: "1px slate 200",
          borderRadius: "10px",
          boxShadow: "0px 2px 4px #000000",
          color: "whitesmoke",
          marginTop: 2,
        }}
      >
        {/* Header (Profile + Username + Date) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: 1,
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton variant="text" width="30%" height={15} />
          </Box>
        </Box>

        {/* Image */}
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ borderRadius: 2, paddingTop: "100%" }}
        />

        {/* Post Footer (Icons & Actions) */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              padding: 1,
              gap: 1,
            }}
          >
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="text" width={20} height={35} />
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="text" width={20} height={35} />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              gap: 1,
              padding: 1,
            }}
          >
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="circular" width={30} height={30} />
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default PostCardSkeleton;
