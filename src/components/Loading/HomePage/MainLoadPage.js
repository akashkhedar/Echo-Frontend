import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import NavbarSkeleton from "./NavbarSkeleton";
import LeftSidebarSkeleton from "./LeftSidebarSkeleton";
import PostCardSkeleton from "./PostCardSkeleton";
import RightSidebarSkeleton from "./RightSidebarSkeleton";

const HomeLayout = ({ children }) => {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "4rem auto", // Navbar height and remaining vertical space
        gridTemplateColumns: "auto", // Columns are controlled inside the second row
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        "&::-webkit-scrollbar": {
          display: "none",
        },
        overflowY: "auto",
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          gridRow: "1 / 2", // Occupies the first row
          gridColumn: "1 / 2", // Full width
          background: "#181818",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NavbarSkeleton />
      </Box>

      {/* Sidebar and Post Section */}
      <Box
        sx={{
          gridRow: "2 / 3", // Occupies the second row
          gridColumn: "1 / 2", // Full width
          display: "flex",
          flexDirection: "row", // Sidebar on the left, content on the right
          height: "100%", // Occupy remaining vertical space
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: { md: "4rem", lg: "13rem" }, // Sidebar width for different breakpoints
            background: "#181818",
          }}
        >
          {/* <Box sx={{ display: { xs: "none", md: "block", lg: "none" } }}>
            <MDSidebar />
          </Box> */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <LeftSidebarSkeleton />
          </Box>
        </Box>

        {/* Main Content */}

        <Box
          component="main"
          sx={{
            flex: 1, // Occupy remaining horizontal space
            paddingRight: { md: "1rem", lg: "2rem" },
            paddingLeft: { md: "1rem", lg: "1rem" },
            background: "#181818",
          }}
        >
          <PostCardSkeleton />
        </Box>

        {!isChatPage && (
          <Box
            sx={{
              width: { md: "4rem", lg: "13rem" }, // QuickChat drawer width for different breakpoints
              background: "#181818",
              display: "flex",
              flexDirection: "column", // Ensures proper layout within QuickChat
            }}
          >
            {/* <Box sx={{ display: { xs: "none", md: "block", lg: "none" } }}>
              <MDQuickChat />
            </Box> */}
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <RightSidebarSkeleton />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomeLayout;
