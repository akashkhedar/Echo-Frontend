import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const About = () => {
  const user = useSelector((state) => state.user);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };
  return (
    <Box
      sx={{
        p: 4,
        background: " #1E1E2F",
        color: "whitesmoke",
        borderRadius: 2,
        height: "100%", // Ensures it covers the full container
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      {/* About Section Header */}
      <Typography variant="h5" fontWeight="bold" gutterBottom mb={4}>
        About
      </Typography>

      {/* Details Grid */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color={"secondary.light"}
          >
            Bio
          </Typography>
          <Typography variant="subtitle1">
            {user.bio || "No bio available."}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color={"secondary.light"}
          >
            Email
          </Typography>
          <Typography variant="body1">{user.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color={"secondary.light"}
          >
            Joined
          </Typography>
          <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color={"secondary.light"}
          >
            Interests
          </Typography>
          <Typography variant="body1">
            {user.interests && user.interests.length > 0
              ? user.interests.join(", ")
              : "No interests listed"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color={"secondary.light"}
          >
            Website
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            <a
              href={user.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit", // Inherits the text color for a clean look
              }}
            >
              {user.website || "No website"}
            </a>
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2, bgcolor: "rgb(136, 79, 144)" }} />

      {/* Footer */}
      <Box>
        <Typography variant="caption" color="whitesmoke">
          * Details are based on the information provided by the user.
        </Typography>
      </Box>
    </Box>
  );
};

export default About;

// Example Usage:
// Replace 'user' object with dynamic data from your application
/*
const user = {
  bio: "I love coding and building amazing things!",
  location: "India",
  email: "akash@example.com",
  joined: "January 2024",
  interests: ["Web Development", "AI", "Blockchain"],
  website: "https://example.com",
};
<About user={user} />;
*/
