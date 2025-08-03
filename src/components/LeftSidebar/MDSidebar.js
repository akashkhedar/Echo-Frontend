import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Avatar, Badge, Box, Divider, styled } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadPost from "../uploadPost/UploadPost";
import axiosInstance from "../../axiosInstance";
import PasswordIcon from "@mui/icons-material/Password";
import NewPassword from "../ChangePassword/NewPassword";

const MDSidebar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const hasUnread = true;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [passModal, setPassModal] = React.useState(false);
  const openPassModal = () => setPassModal(true);
  const closePassModal = () => setPassModal(false);

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status) {
        navigate("/signup");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          height: "calc(100vh - 4rem)",
          marginTop: "4rem",
          width: "4rem",
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
          display: "flex",
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
              borderBottom: "1px solid #323232",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgb(18, 25, 34)",
              },
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onClick={() => navigate("/profile/about")}
          >
            <Avatar
              alt="User Avatar"
              sx={{ width: 40, height: 40 }}
              src={user.profileImage}
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
              <Badge color={hasUnread ? "error" : "default"} variant="dot">
                <ForumOutlinedIcon sx={{ color: "whitesmoke" }} />
              </Badge>
            </Item>

            <Item onClick={() => navigate("/profile/following")}>
              <GroupOutlinedIcon sx={{ color: "whitesmoke" }} />
            </Item>

            <Item onClick={handleOpen}>
              <AddBoxOutlinedIcon sx={{ color: "whitesmoke" }} />
            </Item>
          </Box>
        </Box>

        {/* Upload Modal */}
        <UploadPost open={open} handleClose={handleClose} />

        {/* Logout */}
        <Box>
          <Item onClick={openPassModal}>
            <PasswordIcon sx={{ color: "whitesmoke" }} />
          </Item>
          <Item onClick={handleLogout}>
            <LogoutOutlinedIcon sx={{ color: "whitesmoke" }} />
          </Item>
        </Box>
        <NewPassword open={passModal} handleClose={closePassModal} />
      </Box>
    </Drawer>
  );
};

export default MDSidebar;
