import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import { Avatar, Typography } from "@mui/material";
import {
  bindHover,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import HoverCard from "./HoverCard";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { useNavigate } from "react-router-dom";

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

const UserList = ({ user }) => {
  const navigate = useNavigate();

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  return (
    <Grid key={user.name} size={{ xs: 2, sm: 4, md: 4 }}>
      <Item>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "whitesmoke",
          }}
        >
          <Avatar
            src={user.userProfilePhoto}
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
              userProfilePhoto={user.userProfilePhoto}
            />
          </HoverPopover>
          <Typography variant="subtitle2">{user.name}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
          <PersonRemoveAlt1RoundedIcon
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
        </Box>
      </Item>
    </Grid>
  );
};

export default UserList;
