import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PhotoSizeSelectActualRoundedIcon from "@mui/icons-material/PhotoSizeSelectActualRounded";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

const Controls = ({
  forward,
  backward,
  setFile,
  step,
  handlePost,
  loading,
  hasFile,
  hasCroppedFile,
}) => {
  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the actual File object
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        gap: 2,
        mt: 2,
      }}
    >
      {step === 0 ? (
        <label htmlFor="file-upload">
          <input
            type="file"
            id="file-upload"
            name="file"
            onChange={handleFile}
            accept="image/*"
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ minWidth: "unset" }}
            component="span"
            startIcon={<PhotoSizeSelectActualRoundedIcon />}
          >
            <Typography variant="body1" fontWeight={700}>
              {hasFile ? "Change" : "Upload"}
            </Typography>
          </Button>
        </label>
      ) : (
        <Button
          variant="contained"
          fullWidth
          sx={{ minWidth: "unset" }}
          color="success"
          onClick={backward}
          startIcon={<ArrowBackIcon />}
        >
          <Typography variant="body1" fontWeight={700}>
            Back
          </Typography>
        </Button>
      )}
      {step === 0 ? (
        <Button
          variant="contained"
          color="success"
          onClick={forward}
          disabled={!hasCroppedFile}
          endIcon={<ArrowForwardIcon />}
          fullWidth
          sx={{ minWidth: "unset" }}
        >
          <Typography
            variant="body1"
            fontWeight={700}
            color={hasCroppedFile ? "whitesmoke" : "rgb(58, 58, 60)"}
          >
            Continue
          </Typography>
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePost}
          disabled={!hasCroppedFile || loading}
          fullWidth
          startIcon={<CheckCircleRoundedIcon />}
          sx={{
            backgroundColor: "#ad19d2ff",
            color: "white",
            "&:hover": {
              backgroundColor: "#82109eff",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(102, 14, 125, 1)",
              color: "#fff",
            },
            minWidth: "unset",
          }}
        >
          <Typography
            variant="body1"
            fontWeight={700}
            color={hasCroppedFile ? "whitesmoke" : "rgb(58, 58, 60)"}
          >
            {loading ? "Uploading..." : "Upload"}
          </Typography>
        </Button>
      )}
    </Box>
  );
};

export default Controls;
