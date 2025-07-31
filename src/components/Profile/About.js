import {
  Box,
  Typography,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";

const About = () => {
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        px: isMobile ? 2 : 4,
        py: 3,
        backgroundColor: "#1E1E2F",
        color: "whitesmoke",
        borderRadius: 2,
        mb: isMobile ? 10 : 4, // leaves space for bottom nav if present
        boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
      }}
    >
      {/* Section Header */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        About
      </Typography>

      <Divider sx={{ mb: 3, bgcolor: "rgb(136, 79, 144)" }} />

      {/* User Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            color="secondary.light"
            fontWeight="bold"
          >
            Bio
          </Typography>
          <Typography variant="body1">
            {user.bio || "No bio available."}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            color="secondary.light"
            fontWeight="bold"
          >
            Email
          </Typography>
          <Typography variant="body1">{user.email}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            color="secondary.light"
            fontWeight="bold"
          >
            Joined
          </Typography>
          <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography
            variant="subtitle2"
            color="secondary.light"
            fontWeight="bold"
          >
            Interests
          </Typography>
          <Typography variant="body1">
            {user.interests?.length ? user.interests : "No interests listed"}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            color="secondary.light"
            fontWeight="bold"
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
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, bgcolor: "rgb(136, 79, 144)" }} />

      <Typography variant="caption" color="whitesmoke">
        * Details are based on the information provided by the user.
      </Typography>
    </Box>
  );
};

export default About;
