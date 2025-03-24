import { Search } from "@mui/icons-material";
import { Box, InputAdornment, styled, TextField } from "@mui/material";
import React from "react";

const ListSearch = () => {
  const SearchInput = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#2E2E48",
      borderRadius: theme.spacing(2),
      color: "whitesmoke",
      height: "3rem",
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "rgb(125, 52, 143)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgb(110, 46, 130)",
      },
      "& input": {
        color: "whitesmoke",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.89)",
    },
  }));
  return (
    <Box
      sx={{
        padding: 1,
        position: "sticky",
        top: "48px", // Below the header
        backgroundColor: "#1E1E2F",
        zIndex: 1,
      }}
    >
      <SearchInput
        placeholder="Search Chat"
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ListSearch;
