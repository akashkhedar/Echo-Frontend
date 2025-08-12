import { Avatar, CardHeader, Typography } from "@mui/material";
import {
  bindHover,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import React from "react";
import { useNavigate } from "react-router-dom";
import HoverCard from "../Profile/HoverCard";

const Comment = ({ comment }) => {
  const navigate = useNavigate();

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

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
            <HoverCard id={comment.user._id} />
          </HoverPopover>
        </>
      }
      title={
        <Typography
          variant="body2"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/${comment.user.username}`)}
          color="#d900ffff"
        >
          {comment.user.username}
        </Typography>
      }
      subheader={<Typography variant="body2">{comment.comment}</Typography>}
    />
  );
};

export default Comment;
