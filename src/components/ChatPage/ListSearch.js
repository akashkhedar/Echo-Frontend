import { Search } from "@mui/icons-material";
import { Box, InputAdornment, styled, TextField } from "@mui/material";
import React, { useEffect, useRef } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import ChatSearchDropdown from "./ChatSearchDropdown";

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

  const [searchResults, setSearchResults] = React.useState([]);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");

  const navigate = useNavigate();

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const handleSearch = async (e) => {
    try {
      if (searchInput.length > 0) {
        const res = await axiosInstance.get(`/search?q=${searchInput}`);
        console.log(res.data);
        setSearchResults(res.data);
        setOpenDropdown(true);
      } else {
        setOpenDropdown(false);
        setSearchResults([]);
      }
    } catch (error) {
      console.log(error);
      setOpenDropdown(false);
    }
  };
  const debouncedSearch = debounce(handleSearch, 200);

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpenDropdown(false);
        setSearchInput("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <Box
      sx={{
        padding: 1,
        position: "sticky",
        top: "48px", // Below the header
        backgroundColor: "#1E1E2F",
        zIndex: 1,
      }}
      ref={searchRef}
    >
      <TextField
        ref={searchRef}
        placeholder="Search Chat"
        variant="outlined"
        size="small"
        onChange={handleSearchChange}
        value={searchInput}
        sx={{ width: "100%" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
            </InputAdornment>
          ),
        }}
      />
      <ChatSearchDropdown
        results={searchResults}
        navigate={navigate}
        isOpen={openDropdown}
      />
    </Box>
  );
};

export default ListSearch;
