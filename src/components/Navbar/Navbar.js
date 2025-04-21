import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import { AppBar, Avatar, Badge, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../assets/Icon.png";
import Logo from "../../assets/Logo.png";
import { useSelector } from "react-redux";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 25,
  backgroundColor: "rgb(18, 18, 18)",
  margin: "0 16px",
  height: "2.4rem",
  width: "100%", // Occupy full width in flex container
  maxWidth: "45rem", // Limit to 60% of viewport width
  border: "1px solid #323232 ",
  "&:hover": {
    border: "1px solid rgb(41, 63, 89)",
  },
  "&:focus-within": {
    border: "1px solid rgb(27, 103, 190)",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    color: "whitesmoke",
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      "&:focus": {
        width: "10ch",
      },
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = React.useState(false);
  const user = useSelector((state) => state.user);
  const toggleDrawer = () => {
    if (!isOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <AppBar position="fixed">
      <Box
        px={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: { xs: "3.6rem", sm: "3.6rem", md: "3.7rem" },
          backgroundImage: "linear-gradient(#1E1E2F, #121212)",
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: "white" }} />
            </SearchIconWrapper>
            <StyledInputBase
              sx={{ color: "white", width: "100%" }}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Box>

        {/* Notifications and Avatar */}
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
      </Box>
    </AppBar>
  );
};
export default Navbar;
