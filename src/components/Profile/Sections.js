import { Box, Chip, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectFollowerCount } from "../../redux/selectors/followerSelector";
import { selectFollowingCount } from "../../redux/selectors/followingSelector";

const Sections = () => {
  const followerCount = useSelector(selectFollowerCount);
  const followingCount = useSelector(selectFollowingCount);
  const navigate = useNavigate();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/profile/about");
        break;
      case 1:
        navigate("/profile/followers");
        break;
      case 2:
        navigate("/profile/following");
        break;
      case 3:
        navigate("/profile/post");
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable prevent tabs example"
      >
        <Tab
          label={
            <Typography fontWeight={800} color="secondary" fontSize={16}>
              About
            </Typography>
          }
        />
        <Tab
          label={
            <Typography fontWeight={800} color="secondary" fontSize={16}>
              Followers
              <Chip
                label={followerCount}
                size="small"
                sx={{
                  marginLeft: 1,
                  height: 18,
                  backgroundColor: "rgb(83, 81, 81)",
                  color: "whitesmoke",
                  border: "1px solid rgb(135, 108, 137)",
                }}
              />
            </Typography>
          }
        />
        <Tab
          label={
            <Typography fontWeight={800} color="secondary" fontSize={16}>
              Following
              <Chip
                label={followingCount}
                size="small"
                sx={{
                  marginLeft: 1,
                  height: 18,
                  backgroundColor: "rgb(83, 81, 81)",
                  color: "whitesmoke",
                  border: "1px solid rgb(135, 108, 137)",
                }}
              />
            </Typography>
          }
        />
        <Tab
          label={
            <Typography fontWeight={800} color="secondary" fontSize={16}>
              Posts
            </Typography>
          }
        />
      </Tabs>
    </Box>
  );
};

export default Sections;
