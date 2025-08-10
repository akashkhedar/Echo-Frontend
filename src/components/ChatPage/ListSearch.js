import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, styled, TextField } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import ChatSearchDropdown from "./ChatSearchDropdown";
import useUser from "../../hooks/useUser";

const SearchInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
    backgroundColor: "#2E2E48",
    color: "whitesmoke",
    height: "3rem",
    border: "1px solid #323232",
    "&:hover": {
      borderColor: "rgb(125, 52, 143)",
    },
    "&.Mui-focused": {
      borderColor: "rgb(110, 46, 130)",
    },
    "& input": {
      color: "whitesmoke",
    },
    "& fieldset": {
      border: "none", // Remove default outline
    },
  },
  "& .MuiInputAdornment-root": {
    marginLeft: 0,
    color: "rgba(255, 255, 255, 0.5)",
  },
}));

const ListSearch = () => {
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

  const { data: user } = useUser();

  const handleSearch = async (e) => {
    try {
      if (searchInput.length > 0) {
        const res = await axiosInstance.get(`/user/search?q=${searchInput}`);
        const result = res.data.filter((p) => p._id !== user._id);
        setSearchResults(result);
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
        zIndex: 1,
      }}
      ref={searchRef}
    >
      <SearchInput
        ref={searchRef}
        placeholder="Search Chat"
        variant="outlined"
        size="small"
        onChange={(e) => {
          handleSearchChange(e);
          debouncedSearch();
        }}
        value={searchInput}
        sx={{ width: "100%" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <ChatSearchDropdown
        results={searchResults}
        navigate={navigate}
        isOpen={openDropdown}
        selector={useSelector}
        setOpenDropdown={setOpenDropdown}
      />
    </Box>
  );
};

export default ListSearch;
