import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import WebStoriesOutlinedIcon from "@mui/icons-material/WebStoriesOutlined";
import { Avatar, Badge, Box, Divider, styled } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import UploadPost from "../uploadPost/UploadPost";

const MDSidebar = () => {
  const navigate = useNavigate();
  const Item = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    margin: theme.spacing(0.5, 0),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    transition: "background-color 0.3s ease, color 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.primary.main,
    },
  }));

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          height: "calc(100vh - 4rem)", // Adjust height to exclude navbar
          marginTop: "4rem", // Push down to align below navbar
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
          display: { xs: "none", md: "flex", lg: "none" },
          flexDirection: "column",
          alignItems: "center",
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
              gap: 1,
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f1f1f1",
                color: "#000",
              },
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onClick={() => navigate("/profile/about")}
          >
            <Avatar
              alt="User Avatar"
              sx={{ width: 40, height: 40 }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8mcdA_uoJahxn3PQ-IC9WROV-GF2wuTl2FQ&s"
            />
          </Box>
          {/* Menu Items */}
          <Box>
            <Item onClick={() => navigate("/")}>
              <HomeOutlinedIcon
                sx={{ fontSize: "2rem", color: "whitesmoke" }}
              />
            </Item>
            <Divider
              variant="middle"
              sx={{ bgcolor: "secondary.light", margin: "10px 0 0 7px" }}
            />
            <Item onClick={() => navigate("/chat")}>
              <Badge badgeContent={2} color="error">
                <ForumOutlinedIcon sx={{ color: "whitesmoke" }} />
              </Badge>
            </Item>
            <Item onClick={() => navigate("/profile/friend")}>
              <GroupOutlinedIcon sx={{ color: "whitesmoke" }} />
            </Item>
            <Item>
              <AddBoxOutlinedIcon sx={{ color: "whitesmoke" }} />
            </Item>
            <Item>
              <WebStoriesOutlinedIcon sx={{ color: "whitesmoke" }} />
            </Item>
          </Box>
        </Box>
        <UploadPost open={open} handleClose={handleClose} />
        {/* Bottom Section */}
        <Box>
          <Item>
            <LogoutOutlinedIcon sx={{ color: "whitesmoke" }} />
          </Item>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MDSidebar;
