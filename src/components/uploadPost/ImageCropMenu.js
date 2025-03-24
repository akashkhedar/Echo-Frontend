import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import CropIcon from "@mui/icons-material/Crop";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import Crop32Icon from "@mui/icons-material/Crop32";
import { useState } from "react";
import CropOriginalRoundedIcon from "@mui/icons-material/CropOriginalRounded";
import { useSelector } from "react-redux";

const aspectRatios = [
  { label: "1:1", value: 1, icon: <CropSquareIcon /> },
  { label: "4:5", value: 4 / 5, icon: <CropPortraitIcon /> },
  { label: "16:9", value: 1.91 / 1, icon: <Crop32Icon /> },
];

const ImageCropMenu = ({ handleAspectRatioChange, handleFitToFrame }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const aspectRatio = useSelector((state) => state.ratio);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ display: "inline-block" }}>
      {/* Floating Crop Button */}
      <IconButton
        onClick={handleClick}
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "white",
          borderRadius: "50%",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.6)" },
        }}
        aria-label="Open crop menu"
      >
        <CropIcon />
      </IconButton>

      {/* Aspect Ratio Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "rgba(19, 19, 36, 0.9)", // Dark semi-transparent background
            color: "white",
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleFitToFrame();
            handleClose();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor:
              aspectRatio === null ? "rgba(255, 255, 255, 0.2)" : "transparent",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
          }}
        >
          <IconButton size="small" sx={{ color: "white" }}>
            <CropOriginalRoundedIcon />
          </IconButton>
          <Typography fontWeight={700}>Fit To Frame</Typography>
        </MenuItem>
        {aspectRatios.map(({ label, value, icon }) => (
          <MenuItem
            key={value}
            onClick={() => {
              handleAspectRatioChange(value);
              handleClose();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor:
                aspectRatio === value
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            }}
          >
            <IconButton size="small" sx={{ color: "white" }}>
              {icon}
            </IconButton>
            <Typography fontWeight={700}>{label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ImageCropMenu;
