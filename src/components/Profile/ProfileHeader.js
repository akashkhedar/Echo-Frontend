import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Avatar,
  Box,
  Button,
  Card,
  createTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import female from "../../assets/female.jpg";
import male from "../../assets/male.jpg";
import useUser from "../../hooks/useUser";
import AboutUpdate from "./AboutUpdate";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 750,
      lg: 1024,
      xl: 1200,
    },
  },
});

const ProfileHeader = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: user } = useUser();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card
      sx={{
        boxShadow: 2,
        bgcolor: "black",
        color: "whitesmoke",
        width: "100%",
      }}
    >
      {/* Cover Image */}
      <Box
        sx={{
          height: isMobile ? 160 : 240,
          backgroundImage: `url(${user.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Info Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          px: 2,
          py: 1,
          position: "relative",
          alignItems: "flex-start",
        }}
      >
        {/* Profile Avatar */}
        <Avatar
          alt="Profile"
          src={user.profileImage || (user.gender === "male" ? male : female)}
          sx={{
            width: isMobile ? 72 : 100,
            height: isMobile ? 72 : 100,
            border: "3px solid #d900ffff",
            bgcolor: "#1e1e2f",
            position: "absolute",
            top: isMobile ? -36 : -50,
            left: 16,
          }}
        />

        <Box sx={{ width: isMobile ? 80 : 110 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="bold"
              noWrap
            >
              {user.fullname}
            </Typography>
            <Button
              onClick={handleOpen}
              sx={{
                minWidth: 0,
                p: 0.5,
                ml: 1,
                background: "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              <BorderColorIcon
                sx={{
                  color: " #a9c3fcff",
                  fontSize: isMobile ? 18 : 20,
                }}
              />
            </Button>
          </Box>

          <Typography variant="subtitle2" color="rgb(191, 0, 255)" noWrap>
            @{user.username}
          </Typography>
        </Box>
      </Box>

      {/* Update Dialog */}
      <AboutUpdate open={open} handleClose={handleClose} user={user} />
    </Card>
  );
};

export default ProfileHeader;
