import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import { Avatar, IconButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { experimentalStyled as styled } from "@mui/material/styles";
import debounce from "lodash.debounce";
import {
  bindHover,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import {
  removeFollower,
  removeFollowing,
} from "../../redux/slices/AuthSlice/AuthSlice";
import HoverCard from "./HoverCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgb(21, 21, 35)",
  border: "1px solid  rgb(64, 44, 71)",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
  borderRadius: 30,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const UserList = ({ key, user, setFollowers = null, setFollowing = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const path = location.pathname;
  const [add, setAdd] = useState(true);

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  const updateList = async (userIdToRemove) => {
    if (path === "/profile/followers") {
      setFollowers((prev) => prev.filter((u) => u._id !== userIdToRemove));
      dispatch(removeFollower(userIdToRemove));
    } else {
      setFollowing((prev) => prev.filter((u) => u._id !== userIdToRemove));
      dispatch(removeFollowing(userIdToRemove));
    }
    setAdd((prev) => !prev);
    try {
      if (path === "/profile/followers") {
        await axiosInstance.put(`/user/remove/${userIdToRemove}`);
      } else {
        await axiosInstance.put(`/user/unfollow/${userIdToRemove}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFollower = debounce(updateList, 300);

  return (
    <Grid size={{ xs: 2, sm: 4, md: 4 }}>
      <Item key={key}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "whitesmoke",
          }}
        >
          <Avatar
            src={user.profileImage}
            {...bindHover(popupState)}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/${user.username}`)}
          />

          <HoverPopover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            disableRestoreFocus // Prevents focus-related issues
            disableAutoFocus // Ensures popover doesn't steal focus
            onMouseEnter={() => popupState.open()} // Keeps the popover open on hover
            onMouseLeave={() => popupState.close()} // Closes the popover when the mouse leaves
          >
            <HoverCard
              username={user.username}
              userProfilePhoto={user.profileImage}
            />
          </HoverPopover>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="subtitle2" color="rgb(191, 0, 255)">
              {user.username}
            </Typography>

            <Typography variant="subtitle2" color="rgb(147, 139, 148)">
              {user.fullname}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <QuestionAnswerRoundedIcon
              sx={{
                borderRadius: "50%",
                cursor: "pointer",
                p: 1,
                color: "whitesmoke",
                "&:hover": {
                  backgroundColor: "rgb(48, 48, 62)",
                },
              }}
            />
          </IconButton>
          <IconButton
            sx={{ ml: -1.5 }}
            onClick={() => handleRemoveFollower(user._id)}
          >
            {add ? (
              <PersonRemoveAlt1RoundedIcon
                sx={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  p: 1,
                  color: "rgb(194, 49, 49)",
                  "&:hover": {
                    backgroundColor: "rgb(48, 48, 62)",
                  },
                }}
              />
            ) : (
              <PersonAddAlt1RoundedIcon
                sx={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  p: 1,
                  color: "rgb(49, 194, 56)",
                  "&:hover": {
                    backgroundColor: "rgb(48, 48, 62)",
                  },
                }}
              />
            )}
          </IconButton>
        </Box>
      </Item>
    </Grid>
  );
};

export default UserList;
