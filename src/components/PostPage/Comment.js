import { Avatar, Box, CardHeader, IconButton, Typography } from "@mui/material";
import React from "react";
import {
  bindHover,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import HoverCard from "../Profile/HoverCard";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { useNavigate } from "react-router-dom";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

const Comment = ({ comment }) => {
  const navigate = useNavigate();

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  const [like, setLike] = React.useState(false);

  const handleLike = () => {
    setLike(!like);
  };

  return (
    <CardHeader
      key={comment._id}
      avatar={
        <>
          <Avatar
            src={comment.user.profileImage}
            {...bindHover(popupState)}
            onClick={() => navigate(`/${comment.user.username}`)}
            sx={{ cursor: "pointer" }}
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
          >
            <HoverCard
              username={comment.user.username}
              userProfilePhoto={comment.user.profileImage}
            />
          </HoverPopover>
        </>
      }
      title={
        <Typography
          variant="body2"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/${comment.user.username}`)}
        >
          {comment.user.username}
        </Typography>
      }
      subheader={<Typography variant="body2">{comment.comment}</Typography>}
      action={
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <IconButton
            sx={{
              "&:hover": {
                background: "none",
              },
            }}
            onClick={handleLike}
          >
            {like === true ? (
              <FavoriteRoundedIcon
                sx={{ fontSize: "1rem", color: "red", padding: 0.7 }}
              />
            ) : (
              <FavoriteBorderOutlinedIcon
                sx={{ fontSize: "1rem", color: "whitesmoke", padding: 0.7 }}
              />
            )}
          </IconButton>
          <Typography variant="caption" mt={-2}>
            {like === true ? comment.likes + 1 : comment.likes}
          </Typography>
        </Box>
      }
    />
  );
};

export default Comment;
