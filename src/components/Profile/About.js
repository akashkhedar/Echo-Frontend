import { Box, Grid, Typography } from "@mui/material";
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
      <Box sx={{ gap: 2 }}>
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
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          color={"secondary.light"}
        >
          Email
        </Typography>
        <Typography variant="body1">{user.email}</Typography>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          color={"secondary.light"}
        >
          Joined
        </Typography>
        <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          color={"secondary.light"}
        >
          Interests
        </Typography>
        <Typography variant="body1">
          {user.interests && user.interests.length > 0
            ? user.interests
            : "No interests listed"}
        </Typography>
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
              color: "inherit",
            }}
          >
            {user.website || "No website"}
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default About;
