import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { useSelector } from "react-redux";
import female from "../../assets/female.jpg";
import male from "../../assets/male.jpg";

const ProfileHeader = () => {
  const user = useSelector((state) => state.user);
  return (
    <Card
      sx={{
        borderRadius: 2,
        marginBottom: 3,
        boxShadow: 3,
        width: "100%",
        background: "#1E1E2F",
        color: "whitesmoke",
      }}
    >
      <Box
        sx={{
          height: 320,
          backgroundImage:
            "url(https://static.vecteezy.com/system/resources/thumbnails/024/692/112/small_2x/ai-generated-ai-generative-beautiful-rhododendron-flowers-over-sunset-mountains-field-landscape-graphic-art-photo.jpg)",
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
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
            width: 150,
            height: 150,
            border: "3px solid white",
            zIndex: 1,
            mb: 2.8,
          }}
        />
        <Box
          sx={{
            marginLeft: 2,
            marginTop: "5.1rem",
            px: 1,
            py: 2,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user.fullname}
            </Typography>
            <Typography color="whitesmoke">{`@${user.username}`}</Typography>
          </Box>

          <Button
            sx={{
              borderRadius: "30px",
              backgroundColor: "rgb(39, 39, 52)",
              "&:hover": {
                background: "rgb(57, 57, 60)",
              },
              gap: 1.5,
              mt: 0.6,
              px: 2,
            }}
          >
            <IconButton>
              <CreateRoundedIcon sx={{ color: "whitesmoke" }} />
            </IconButton>
            <Typography variant="subtitle2" color="whitesmoke">
              Edit Profile
            </Typography>
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ProfileHeader;
