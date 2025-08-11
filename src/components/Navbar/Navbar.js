import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Avatar,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../assets/Icon.png";
import Logo from "../../assets/Logo.png";
import axiosInstance from "../../axiosInstance";
import useUser from "../../hooks/useUser";
import SearchDropdown from "./SearchDropdown";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchResults, setSearchResults] = React.useState([]);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const { data: user } = useUser();

  const searchRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args); // Use passed arguments directly
      }, delay);
    };
  }

  const handleSearch = async (query) => {
    try {
      if (query.length > 0) {
        const res = await axiosInstance.get(`/user/search?q=${query}`);
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

  const debouncedSearch = useRef(debounce(handleSearch, 200)).current;

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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

  const searchInputRef = useRef("");
  useEffect(() => {
    searchInputRef.current = searchInput;
  }, [searchInput]);

  return (
    <AppBar position="fixed">
      <Box
        px={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: { xs: "3.6rem", sm: "3.6rem", md: "3.7rem" },
          backgroundImage: "#121212",
        }}
      >
        {/* Logo and Icon */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onClick={() => navigate("/")}
        >
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: { md: "8rem", lg: "10rem" },
              height: { md: "4rem", lg: "4.5rem" },
              "&:hover": { cursor: "pointer" },
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ height: "100%", width: "100%" }}
            />
          </Box>
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              width: { xs: "3rem", sm: "3.4rem" },
              height: { xs: "4rem", sm: "4.3rem" },
              "&hover": { cursor: "pointer" },
            }}
          >
            <img
              src={Icon}
              alt="icon"
              style={{ height: "100%", width: "100%" }}
            />
          </Box>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          ref={searchRef}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch(e.target.value);
            }}
            onFocus={() => setOpenDropdown(true)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                backgroundColor: "#1E1E2F",
                color: "white",
                height: "2.5rem",
                paddingLeft: 1,
                border: "1px solid #2c2c2c",
                transition: "border 0.2s ease",
                "&:hover": {
                  borderColor: "#3f3f3f",
                },
                "&.Mui-focused": {
                  borderColor: "#0078FF",
                  boxShadow: "0 0 0 2px rgba(0, 120, 255, 0.2)",
                },
              },
              input: {
                color: "white",
                padding: "0 10px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white", ml: 1 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Dropdown Component */}
          <SearchDropdown
            results={searchResults}
            navigate={navigate}
            isOpen={openDropdown}
            userId={user._id}
            dropdownRef={dropdownRef}
            setOpenDropdown={setOpenDropdown}
            setSearchInput={setSearchInput}
          />
        </Box>

        {/* Notifications and Avatar */}
        {!isMobile ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton size="large" aria-label="show avatar" color="inherit">
              <Avatar
                alt="Avatar"
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: { sm: "2.3rem", md: "2.4rem", lg: "2.5rem" },
                  height: { sm: "2.3rem", md: "2.4rem", lg: "2.5rem" },
                  border: "2px solid #0078FF",
                }}
                onClick={() => navigate("/profile/about")}
                src={user.profileImage}
              />
            </IconButton>
          </Box>
        ) : null}
      </Box>
    </AppBar>
  );
};
export default Navbar;
