import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PasswordIcon from "@mui/icons-material/Password";
import { Avatar, Badge, Box, Divider, styled } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import useConversationList from "../../hooks/useConversationList";
import useUser from "../../hooks/useUser";
import NewPassword from "../ChangePassword/NewPassword";
import UploadPost from "../uploadPost/UploadPost";

const MDSidebar = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const { data: conversations = [] } = useConversationList(user._id);
  const hasUnread = conversations.some((c) => c.unread);
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
          height: "calc(100vh - 4.5rem)",
          marginTop: "4rem",
          width: "4rem",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          borderTop: "1.5px solid #1f1f1fff",
          borderRight: "1.5px solid #1f1f1fff",
          borderBottom: "1.5px solid #1f1f1fff",
          backgroundColor: "black",
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
              sx={{ margin: "0px 0", width: "100%", background: "#323232 " }}
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
