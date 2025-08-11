import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const BoxHead = ({ handleClose }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
        mb: 1.5,
      }}
    >
      <IconButton
        sx={{
          backgroundColor: "rgb(25, 25, 23)",
          height: { xs: "2.5rem", sm: "2.7rem" },
          width: { xs: "2.5rem", sm: "2.7rem" },
          mt: 1,
          color: "rgb(100, 100, 107)",
          "&:hover": {
            backgroundColor: "rgb(21, 21, 24)",
          },
        }}
        onClick={() => {
          handleClose();
        }}
      >
        <CloseRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default BoxHead;
