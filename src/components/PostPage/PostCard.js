import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import { Alert, Menu, MenuItem } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import {
  bindHover,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import useUser from "../../hooks/useUser";
import socket from "../../utils/socket";
import HoverCard from "../Profile/HoverCard";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
}));

const PostCard = ({ post, setPosts = null }) => {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = React.useState(false);

  const [isReported, setisReported] = React.useState(false);
  const [viewCommment, setViewComment] = React.useState(false);

  const countLikes = post.likes.length;
  const [likeCount, setLikeCount] = React.useState(countLikes);

  const countComment = post.comments.length;
  const [commentCount, setCommentCount] = React.useState(countComment);

  const { data: user } = useUser();

  const hasLiked = post.likes.includes(user._id);

  const [liked, setLiked] = React.useState(hasLiked);

  const navigate = useNavigate();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = async (id) => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    try {
      setLiked(!liked);
      await axiosInstance.put(`/post/like/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDebouncedLike = debounce(handleLike, 300);

  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  const [openShare, setOpenShare] = React.useState(false);
  const openShareModal = () => setOpenShare(true);
  const closeShareModal = () => setOpenShare(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReport = () => {
    handleClose();
    setisReported(true);
    setTimeout(() => {
      setisReported(false);
    }, 1000);
  };

  const handleDeletePost = async () => {
    handleClose();
    try {
      const res = await axiosInstance.delete(`/post/delete/${post._id}`);
      if (res.status === 200) {
        socket.emit("postDeleted", { postId: post._id, userId: user._id });

        queryClient.setQueryData(["posts", user._id], (old) =>
          old ? old.filter((p) => p._id !== post._id) : []
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComment = () => {
    setViewComment(!viewCommment);
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    const truncated = text.slice(0, limit);
    return truncated.slice(0, truncated.lastIndexOf(" ")) + "...";
  };

  function formatDate(isoString) {
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const getPaddingTop = (aspectRatio) => {
    if (!aspectRatio || isNaN(aspectRatio)) return "100%";
    return `${(1 / aspectRatio) * 100}%`;
  };

  return (
    <>
      <Card
        key={post._id}
        sx={{
          width: {
            xs: "97%",
            sm: "80%",
            md: "62%",
            lg: "53%",
            xl: "40%",
          },
          marginBottom: 2,
          background: "#1E1E2F",
          border: "1px slate 200",
          borderRadius: "10px",
          boxShadow: "0px 2px 4px #000000",
          color: "whitesmoke",
          marginTop: 2,
        }}
      >
        <CardHeader
          avatar={
            <>
              <Avatar
                src={post.userId.profileImage}
                {...bindHover(popupState)}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/${post.userId.username}`)}
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
                  id={post.userId._id}
                  username={post.userId.username}
                  profilePhoto={post.userId.profileImage}
                  follower={post.userId.follower.length}
                  following={post.userId.following.length}
                />
              </HoverPopover>
            </>
          }
          action={
            <>
              <IconButton
                aria-label="settings"
                sx={{ color: "whitesmoke", paddingTop: 2 }}
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleReport} sx={{ color: "red" }}>
                  Report Post
                </MenuItem>
                {post.userId._id === user._id ? (
                  <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
                ) : null}
              </Menu>
            </>
          }
          title={
            <Typography
              variant="body1"
              fontFamily={"Roboto"}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/${post.userId.username}`)}
            >
              {post.userId.username}
            </Typography>
          }
          subheader={
            <Typography variant="body2" fontFamily={"Roboto"}>
              {formatDate(post.createdAt)}
            </Typography>
          }
          sx={{
            "& .MuiCardHeader-title": {
              color: "whitesmoke",
              "&:hover": {
                cursor: "pointer",
              },
            },
            "& .MuiCardHeader-subheader": {
              color: "whitesmoke",
            },
            paddingY: "0.7rem",
          }}
        />

        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          {isReported && (
            <Alert
              severity="warning"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1300,
                textAlign: "center",
              }}
            >
              Posted Reported
            </Alert>
          )}
          <CardMedia
            image={post.media}
            sx={{
              height: 0,
              paddingTop: getPaddingTop(post.ratio),
            }}
            alt="user post"
          />
        </Box>
        <CardActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingX: 1,
          }}
        >
          {/* Left Actions */}
          <Box display={"flex"} alignItems={"center"}>
            <IconButton
              onClick={() => handleDebouncedLike(post._id)}
              aria-label="add to favorites"
              sx={{ color: "whitesmoke" }}
            >
              {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" mr={1}>
              {likeCount}
            </Typography>
            <IconButton
              aria-label="comment"
              onClick={toggleComment}
              sx={{ color: "whitesmoke" }}
            >
              <ChatOutlinedIcon />
            </IconButton>
            <Typography variant="body2">{commentCount}</Typography>
          </Box>
          {/* Right Actions */}
          <Box display={"flex"} alignItems={"center"}>
            <IconButton
              aria-label="share"
              onClick={openShareModal}
              sx={{ color: "whitesmoke" }}
            >
              <ShareIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              sx={{
                color: "whitesmoke",
                display: post.caption.length > 75 ? "flex" : "none",
              }}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Box>
        </CardActions>
        <ShareModal
          closeShareModal={closeShareModal}
          postId={post._id}
          openShare={openShare}
        />

        <CardContent
          sx={{ marginBottom: -1.5, marginTop: -2.6, fontFamily: "Roboto" }}
        >
          {expanded || post.caption.length < 75
            ? post.caption
            : truncateText(post.caption, 75)}
        </CardContent>
        <CardContent
          sx={{
            marginBottom: -2.3,
            marginTop: -2.6,
            fontFamily: "Roboto",
            marginX: "-1rem",
          }}
        >
          {viewCommment && (
            <CardActions>
              <CommentSection
                postId={post._id}
                setCommentCount={setCommentCount}
              />
            </CardActions>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PostCard;
