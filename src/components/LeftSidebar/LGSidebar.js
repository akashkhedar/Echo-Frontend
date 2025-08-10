import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import { Avatar, Badge, Box, Divider, styled, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import useConversationList from "../../hooks/useConversationList";
import useUser from "../../hooks/useUser";
import NewPassword from "../ChangePassword/NewPassword";
import UploadPost from "../uploadPost/UploadPost";

const LGSidebar = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const { data: conversations = [] } = useConversationList(user._id);
  const hasUnread = conversations.some((c) => c.unread);

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
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.status) {
        navigate("/signup");
      }
    } catch (error) {}
  };
  const [passModal, setPassModal] = React.useState(false);
  const openPassModal = () => setPassModal(true);
  const closePassModal = () => setPassModal(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          height: "calc(100vh - 4rem)",
          marginTop: "4rem",
          width: "13rem",
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
              justifyItems: "center",
              padding: 2,
              gap: 1,
              borderBottom: "1px solid #323232",
              cursor: "pointer",
              color: "whitesmoke",
              "&:hover": {
                backgroundColor: "rgb(18, 25, 34)",
              },
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onClick={() => navigate("/profile/about")}
          >
            <Avatar
              alt="User Avatar"
              sx={{ width: 60, height: 60 }}
              src={user.profileImage}
            />
            <Typography variant="subtitle1" fontWeight="bold">
              {user.username}
            </Typography>
          </Box>
          <Box
            sx={{
              paddingBottom: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
            }}
          >
            {/* Menu Items */}
            <Item
              onClick={() => navigate("/")}
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgb(18, 25, 34)",
                },
              }}
            >
              <HomeOutlinedIcon sx={{ color: "whitesmoke" }} />
              <Typography variant="body1" flex={1} sx={{ color: "whitesmoke" }}>
                Home
              </Typography>
            </Item>
            <Divider
              sx={{ margin: "0px 0", width: "100%", background: "#323232 " }}
            />
            <Typography
              variant="subtitle2"
              fontSize={14}
              sx={{ margin: "10px 16px", color: "#B0B0B0 " }}
            >
              Features
            </Typography>
            <Item
              onClick={() => navigate("/chat")}
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgb(18, 25, 34)",
                },
              }}
            >
              <Badge color={hasUnread ? "error" : "default"} variant="dot">
                <ForumOutlinedIcon sx={{ color: "whitesmoke" }} />
              </Badge>
              <Typography variant="body1" flex={1} sx={{ color: "whitesmoke" }}>
                Chat
              </Typography>
            </Item>
            <Item
              onClick={() => navigate("/profile/following")}
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgb(18, 25, 34)",
                },
              }}
            >
              <GroupOutlinedIcon sx={{ color: "whitesmoke" }} />
              <Typography variant="body1" flex={1} sx={{ color: "whitesmoke" }}>
                Friends
              </Typography>
            </Item>
            <Item
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "rgb(18, 25, 34)",
                },
              }}
              onClick={handleOpen}
            >
              <AddBoxOutlinedIcon sx={{ color: "whitesmoke" }} />
              <Typography variant="body1" flex={1} sx={{ color: "whitesmoke" }}>
                Post
              </Typography>
            </Item>
          </Box>
        </Box>
        <UploadPost open={open} handleClose={handleClose} />
        {/* Bottom Section */}
        <Box
          sx={{
            paddingBottom: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Item
            sx={{
              width: "100%",
              "&:hover": {
                backgroundColor: "rgb(18, 25, 34)",
              },
            }}
            onClick={openPassModal}
          >
            <PasswordIcon sx={{ color: "whitesmoke" }} />
            <Typography variant="body1" flex={1} sx={{ color: "whitesmoke" }}>
              Forget Password
            </Typography>
          </Item>
          <Item
            sx={{
              width: "100%",
              "&:hover": {
                backgroundColor: "rgb(18, 25, 34)",
              },
            }}
            onClick={handleLogout}
          >
            <LogoutOutlinedIcon sx={{ color: "whitesmoke" }} />
            <Typography variant="body1" flex={1} sx={{ color: "whitesmoke" }}>
              Logout
            </Typography>
          </Item>
        </Box>
      </Box>
      <NewPassword open={passModal} handleClose={closePassModal} />
    </Drawer>
  );
};

export default LGSidebar;
