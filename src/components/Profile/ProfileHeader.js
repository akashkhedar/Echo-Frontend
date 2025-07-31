import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
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
import { useSelector } from "react-redux";
import female from "../../assets/female.jpg";
import male from "../../assets/male.jpg";
import AboutUpdate from "./AboutUpdate";

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 400,
      tablet: 750,
      laptop: 1024,
      desktop: 1200,
    },
  },
});

const ProfileHeader = () => {
  const isTablet = useMediaQuery(theme.breakpoints.down("tablet"));
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
  const isVerySmall = useMediaQuery("(max-width:335px)");

  const user = useSelector((state) => state.user);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        marginBottom: 3,
        boxShadow: 3,
        flexGrow: 1,
        background: "#1E1E2F",
        color: "whitesmoke",
      }}
    >
      <Box
        sx={{
          height: isMobile ? 200 : isTablet ? 250 : 290,
          backgroundImage:
            "url(https://static.vecteezy.com/system/resources/thumbnails/024/692/112/small_2x/ai-generated-ai-generative-beautiful-rhododendron-flowers-over-sunset-mountains-field-landscape-graphic-art-photo.jpg)",
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: 2,
          position: "relative",
          top: -110,
          marginBottom: "-8.5rem",
        }}
      >
        <Avatar
          alt="Profile Picture"
          src={user.profileImage || (user.gender === "male" ? male : female)}
          sx={{
            width: isMobile ? 100 : isTablet ? 100 : 150,
            height: isMobile ? 100 : isTablet ? 100 : 150,
            border: "3px solid white",
            zIndex: 1,
            mb: 2.8,
            bgcolor: "#1e1e2f",
          }}
        />
        <Box
          sx={{
            marginLeft: isMobile ? 0 : isTablet ? 1 : 2,
            marginTop: "5.1rem",
            px: 1,
            py: 2,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "flex-start" : "space-between",
            gap: isVerySmall ? 1 : isMobile ? 8 : 3,
          }}
        >
          {/* Name Section */}
          <Box
            sx={{
              maxWidth: isVerySmall ? "80%" : "70%",
              overflow: "hidden",
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : isTablet ? "h6" : "h5"}
              fontWeight="bold"
              noWrap
            >
              {user.fullname}
            </Typography>
            <Typography
              variant={isMobile ? "subtitle2" : "subtitle1"}
              color="rgb(191, 0, 255)"
              noWrap
            >
              @{user.username}
            </Typography>
          </Box>

          {/* Edit Button */}
          <Button
            onClick={handleOpen}
            sx={{
              backgroundColor: "rgb(39, 39, 52)",
              "&:hover": {
                backgroundColor: "rgb(57, 57, 60)",
              },
              gap: 1.2,
              padding: isTablet ? 0 : "6px 16px",
              minWidth: isTablet ? "42px" : "auto",
              height: isTablet ? "42px" : "36px",
              width: isTablet ? "42px" : "auto",
              borderRadius: isTablet ? "50%" : "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ml: isVerySmall ? 1.5 : 0, // adds space if name takes full width
            }}
          >
            <CreateRoundedIcon
              sx={{
                color: "whitesmoke",
                fontSize: isMobile ? 18 : isTablet ? 20 : 24,
              }}
            />
            {!isTablet && !isVerySmall && (
              <Typography
                variant="subtitle2"
                color="whitesmoke"
                sx={{ ml: 1, fontWeight: 500 }}
              >
                Edit Profile
              </Typography>
            )}
          </Button>
        </Box>
      </Box>
      <AboutUpdate open={open} handleClose={handleClose} user={user} />
    </Card>
  );
};

export default ProfileHeader;
