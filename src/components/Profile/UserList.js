import {
  QuestionAnswerRounded as MessageIcon,
  PersonRemoveAlt1Rounded as RemoveIcon,
} from "@mui/icons-material";
import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import {
  bindHover,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { useNavigate } from "react-router-dom";
import HoverCard from "./HoverCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgb(21, 21, 35)",
  border: "1px solid rgb(64, 44, 71)",
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  borderRadius: 30,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  minHeight: "70px",
}));

const UserList = ({ user, onRemove }) => {
  const navigate = useNavigate();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "user-hover-popover",
  });

  return (
    <Item>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minWidth: 0,
          flex: 1,
          flexWrap: "nowrap",
        }}
      >
        <Avatar
          src={user.profileImage}
          {...bindHover(popupState)}
          sx={{
            cursor: "pointer",
            bgcolor: "#303049ff",
            flexShrink: 0,
            width: 40,
            height: 40,
          }}
          onClick={() => navigate(`/${user.username}`)}
        />

        <HoverPopover
          {...bindPopover(popupState)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          disableRestoreFocus
          disableAutoFocus
          onMouseEnter={popupState.open}
          onMouseLeave={popupState.close}
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
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="subtitle2"
            color="rgb(191, 0, 255)"
            sx={{
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: "140px", sm: "170px", md: "200px" },
            }}
          >
            {user.username}
          </Typography>
          <Typography
            variant="caption"
            color="rgb(147, 139, 148)"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: { xs: "140px", sm: "170px", md: "200px" },
            }}
          >
            {user.fullname}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexShrink: 0,
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate(`/messages/${user._id}`)}
        >
          <MessageIcon
            sx={{
              p: 1,
              color: "whitesmoke",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "rgb(48, 48, 62)" },
            }}
          />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => {
            onRemove(user._id);
          }}
        >
          <RemoveIcon
            sx={{
              p: 1,
              color: "rgb(194, 49, 49)",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "rgb(48, 48, 62)" },
            }}
          />
        </IconButton>
      </Box>
    </Item>
  );
};

export default UserList;
