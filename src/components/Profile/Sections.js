import { Box, Button, ButtonGroup, Chip, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sections = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <ButtonGroup color="secondary" aria-label="Medium-sized button group">
        <Button onClick={() => navigate("/profile/about")}>
          <Typography fontWeight={800} fontSize={16}>
            About
          </Typography>
        </Button>
        <Button onClick={() => navigate("/profile/followers")}>
          <Typography fontWeight={800} fontSize={16}>
            Followers
            <Chip
              label="2"
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
        </Button>
        <Button onClick={() => navigate("/profile/following")}>
          <Typography fontWeight={800} fontSize={16}>
            Following
            <Chip
              label="2"
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
        </Button>
        <Button onClick={() => navigate("/profile/post")}>
          <Typography fontWeight={800} fontSize={16}>
            Posts
          </Typography>
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default Sections;
