import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
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
import HoverPopover from "material-ui-popup-state/HoverPopover";
import {
  bindHover,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import HoverCard from "../Profile/HoverCard";
import CommentSection from "./CommentSection";
import PostModal from "./PostModal";

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

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [isReported, setisReported] = React.useState(false);
  const [viewPost, setViewPost] = React.useState(false);
  const [viewCommment, setViewComment] = React.useState(false);

  const navigate = useNavigate();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleSaveClick = () => {
    setSaved(!saved);
  };
  const popupState = usePopupState({
    variant: "popover",
    popupId: "demoPopover",
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = () => {
    handleClose();
    setIsCopied(true);
    handleClose();
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleReport = () => {
    handleClose();
    setisReported(true);
    setTimeout(() => {
      setisReported(false);
    }, 1000);
  };

  const handleViewPost = () => {
    handleClose();
    setViewPost(true);
  };

  const handleModal = () => {
    handleClose();
    setViewPost(false);
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
    const date = new Date(isoString); // Convert ISO string to Date object

    // Format the date
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    // Combine into a readable format (e.g., DD-MM-YYYY HH:mm:ss)
    return `${day}-${month}-${year}`;
  }

  return (
    <>
      <Card
        key={post.id}
        sx={{
          width: {
            xs: "100%", // Full width on mobile
            sm: "92%", // Slightly reduced on small screens
            md: "67%", // Larger size on medium screens
            lg: "52%", // Instagram-like width for desktop
            xl: "40%", // Even more compact on extra-large screens
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
                  post={5}
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
                  Report
                </MenuItem>
                <MenuItem onClick={() => navigate(`/${post.userId.username}`)}>
                  View Account
                </MenuItem>
                <MenuItem onClick={handleViewPost}>View Post</MenuItem>
                <MenuItem onClick={handleShare}>Share</MenuItem>
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
          {isCopied && (
            <Alert
              severity="success"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1300,
              }}
            >
              Link Copied!
            </Alert>
          )}
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
              paddingTop:
                post.aspectRatio === "16:9"
                  ? "56.25%"
                  : post.aspectRatio === "1.91:1"
                    ? "52.36%"
                    : "100%",
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
              onClick={handleLikeClick}
              aria-label="add to favorites"
              sx={{ color: "whitesmoke" }}
            >
              {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" mr={1}>
              {liked ? post.likes.length + 1 : post.likes.length}
            </Typography>
            <IconButton
              aria-label="comment"
              onClick={toggleComment}
              sx={{ color: "whitesmoke" }}
            >
              <ChatOutlinedIcon />
            </IconButton>
            <Typography variant="body2">{post.comments.length}</Typography>
          </Box>
          {/* Right Actions */}
          <Box display={"flex"} alignItems={"center"}>
            <IconButton
              onClick={handleSaveClick}
              aria-label="save"
              sx={{ color: "whitesmoke" }}
            >
              {saved ? (
                <BookmarkIcon color="primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            <IconButton aria-label="share" sx={{ color: "whitesmoke" }}>
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

        <CardContent
          sx={{ marginBottom: -1.5, marginTop: -2.6, fontFamily: "Roboto" }}
        >
          {expanded || post.caption.length < 75
            ? post.caption
            : truncateText(post.caption, 75)}
        </CardContent>
        <CardContent
          sx={{
            marginBottom: -1.5,
            marginTop: -2.6,
            fontFamily: "Roboto",
            marginX: "-1rem",
          }}
        >
          {viewCommment && (
            <CardActions>
              <CommentSection />
            </CardActions>
          )}
        </CardContent>

        {viewPost && <PostModal isOpen={viewPost} handleClose={handleModal} />}
      </Card>
    </>
  );
};

export default PostCard;
