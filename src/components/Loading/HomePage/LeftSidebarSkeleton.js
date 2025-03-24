import { Box, Divider, Drawer, Skeleton, styled } from "@mui/material";

const LeftSidebarSkeleton = () => {
  const Item = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    margin: theme.spacing(0.5, 0),
    borderRadius: theme.shape.borderRadius,
    transition: "background-color 0.3s ease, color 0.3s ease",
    cursor: "pointer",
    width: "100%",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          height: "calc(100vh - 4rem)",
          marginTop: "4.3rem",
          width: { md: "4rem", lg: "13rem" },
          borderTopRightRadius: "8px",
          borderTop: "1.5px solid #333",
          borderRight: "1.5px solid #333",
          backgroundColor: "#1E1E2F",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Profile Section */}
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
              gap: 1.5,
              borderBottom: "1px solid #323232",
              cursor: "default",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Skeleton variant="circular" width={60} height={60} />
            <Skeleton
              variant="subtitle1"
              width={100}
              sx={{ borderRadius: 2 }}
            />
          </Box>

          <Box>
            <Item
              sx={{
                cursor: "default",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="body1" sx={{ borderRadius: 2 }} width="60%" />
            </Item>
          </Box>
          <Divider sx={{ width: "100%", background: "#323232" }} />

          <Box>
            {/* Menu Items */}
            {[...Array(3)].map((_, index) => (
              <Item
                key={index}
                sx={{
                  cursor: "default",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton
                  variant="body1"
                  width="60%"
                  sx={{ borderRadius: 2 }}
                />
              </Item>
            ))}
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box sx={{ paddingBottom: 2 }}>
          <Item
            sx={{
              cursor: "default",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="body1" width="60%" sx={{ borderRadius: 2 }} />
          </Item>
        </Box>
      </Box>
    </Drawer>
  );
};

export default LeftSidebarSkeleton;
