import { Box, TextField, Typography } from "@mui/material";

export default function PostCreator({ about, setAbout }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(25, 24, 24)",
        border: "1px solid rgb(62, 46, 62)",
        borderRadius: 2,
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
              "&.Mui-focused": { color: "lightgray" }, // Label color on focus
              "&:hover": { color: "#d3d3d3" }, // Label color on hover
            },
          }}
          sx={{
            backgroundColor: "#292929",
            borderRadius: "8px",
            input: { color: "#fff" },
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgb(50, 50, 56)", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "rgb(80, 44, 96)", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main", // Border color when focused (or use a custom purple shade like "#9c27b0")
              },
            },
          }}
        />
      </form>
    </Box>
  );
}
