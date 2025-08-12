import { Box, TextField, Typography } from "@mui/material";

export default function PostCreator({ about, setAbout }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: { xs: 2, sm: 3 },
        color: "whitesmoke",
        overflowY: "auto",
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={700} mb={2}>
        Create Post
      </Typography>

      <form>
        <TextField
          fullWidth
          label="What's on your mind?"
          variant="outlined"
          value={about.caption}
          rows={4}
          multiline
          onChange={(e) =>
            setAbout((prev) => ({ ...prev, caption: e.target.value }))
          }
          InputLabelProps={{
            sx: {
              color: "whitesmoke",
              "&.Mui-focused": { color: "lightgray" },
              "&:hover": { color: "#d3d3d3" },
            },
          }}
          InputProps={{
            sx: {
              color: "white", // <-- Text color
            },
          }}
          sx={{
            backgroundColor: "#121010ff",
            borderRadius: "8px",
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgb(50, 50, 56)",
              },
              "&:hover fieldset": {
                borderColor: "rgb(80, 44, 96)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main",
              },
            },
          }}
        />
      </form>
    </Box>
  );
}
