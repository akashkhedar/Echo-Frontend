import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import * as React from "react";

const RightSidebarSkeleton = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          height: "calc(100vh - 18.1rem)", // Adjust height to exclude navbar
          marginTop: "4.3rem", // Push down to align below navbar
          width: { md: "4rem", lg: "14rem" },
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          borderTop: "1.5px solid #333",
          borderLeft: "1.5px solid #333",
          borderBottom: "1.5px solid #333",
          backgroundColor: "#1E1E2F",
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        },
      }}
    >
      {/* Quick Chat Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          padding: "0.5rem",
          gap: 2,
        }}
      >
        <Skeleton variant="circular" width={45} height={45} />
        <Skeleton
          variant="h1"
          width={130}
          height={35}
          sx={{ borderRadius: 3 }}
        />
      </Box>
      <List sx={{ overflow: "hidden" }}>
        {[...Array(5)].map((_, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ marginY: "0.5rem" }}>
              <ListItemButton
                sx={{
                  display: "flex",
                  gap: 2,
                  cursor: "default",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Skeleton variant="circular" width={35} height={35} />
                <Skeleton
                  variant="body1"
                  width={120}
                  height={25}
                  sx={{ borderRadius: 3 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider variant="middle" sx={{ bgcolor: "secondary.light" }} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default RightSidebarSkeleton;
