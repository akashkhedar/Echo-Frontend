import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PhotoSizeSelectActualRoundedIcon from "@mui/icons-material/PhotoSizeSelectActualRounded";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Controls = ({ forward, backward, file, setFile, step, handlePost }) => {
  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile((prev) => ({
        ...prev,
        file: URL.createObjectURL(selectedFile), // Store the actual File object, not a preview URL
      }));
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
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
            style={{ display: "none" }}
          />
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<PhotoSizeSelectActualRoundedIcon />}
          >
            <Typography variant="body1" fontWeight={700}>
              {file.file ? "Change" : "Upload"}
            </Typography>
          </Button>
        </label>
      ) : (
        <Button
          variant="contained"
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
          disabled={!file.file}
          endIcon={<ArrowForwardIcon />}
        >
          <Typography
            variant="body1"
            fontWeight={700}
            color={file.file ? "whitesmoke" : "rgb(58, 58, 60)"}
          >
            Continue
          </Typography>
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePost}
          disabled={!file.file}
          startIcon={<CheckCircleRoundedIcon />}
        >
          <Typography
            variant="body1"
            fontWeight={700}
            color={file.file ? "whitesmoke" : "rgb(58, 58, 60)"}
          >
            Upload
          </Typography>
        </Button>
      )}
    </Box>
  );
};

export default Controls;
