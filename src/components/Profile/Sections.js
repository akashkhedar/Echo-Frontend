import { Box, Chip, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useConnections from "../../hooks/useConnections";
import useUser from "../../hooks/useUser";

const Sections = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const pathMap = {
    "/profile/about": 0,
    "/profile/followers": 1,
    "/profile/following": 2,
    "/profile/post": 3,
  };

  const initialPath = pathMap[path] ?? 0;

  const [value, setValue] = React.useState(initialPath);
  const handleChange = (newValue) => setValue(newValue);

  const { data: user } = useUser();

  const { data: followers = [] } = useConnections(user._id, "followers");
  console.log(followers);
  const { data: following = [] } = useConnections(user._id, "following");
  console.log(following);

  const theme = useTheme();

  const tabStyle = {
    textTransform: "none",
    minWidth: 90,
    px: 2,
    py: 1,
    borderRadius: 10,
    whiteSpace: "nowrap",
    color: "whitesmoke",
    "&.Mui-selected": {
      backgroundColor:
        theme.palette.mode === "dark" ? "rgba(166, 0, 255, 0.15)" : "#f3e5ff",
    },
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: 14,
    color: "black",
    display: "flex",
    alignItems: "center",
  };

  const chipStyle = {
    ml: 0.5,
    height: 18,
    fontSize: "0.7rem",
    backgroundColor: "#555",
    color: "#fff",
    border: "1px solid #888",
  };

  return (
    <Box
      sx={{
        maxWidth: {
          xs: "95vw",
          sm: 400,
          md: 500,
          lg: 600,
          xl: 700,
        },
        borderRadius: 10,
        my: 2,
        bgcolor: "#590d74ff",
      }}
    >
      <Tabs
        value={value}
        onChange={(_, newValue) => handleChange(newValue)}
        variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable tabs"
        sx={{
          "& .MuiTabs-flexContainer": {
            gap: 1,
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
          borderRadius: 10,
        }}
      >
        <Tab
          onClick={() => navigate("/profile/about")}
          label={<Typography sx={labelStyle}>About</Typography>}
          sx={tabStyle}
        />
        <Tab
          onClick={() => navigate("/profile/followers")}
          label={
            <Box sx={labelStyle}>
              Followers
              <Chip label={followers.length} size="small" sx={chipStyle} />
            </Box>
          }
          sx={tabStyle}
        />
        <Tab
          onClick={() => navigate("/profile/following")}
          label={
            <Box sx={labelStyle}>
              Following
              <Chip label={following.length} size="small" sx={chipStyle} />
            </Box>
          }
          sx={tabStyle}
        />
        <Tab
          onClick={() => navigate("/profile/post")}
          label={<Typography sx={labelStyle}>Posts</Typography>}
          sx={tabStyle}
        />
      </Tabs>
    </Box>
  );
};

export default Sections;
