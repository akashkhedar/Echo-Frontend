import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import useConnections from "../../hooks/useConnections";

const SearchList = ({ user, handleMessage, handleFollow, handleUnfollow }) => {
  const userId = useSelector((state) => state.user.userId);
  const { data: following = [] } = useConnections(userId, "following");

  const [isProcessing, setIsProcessing] = useState(false);

  const isFollowing = useMemo(() => {
    return following?.some((u) => u._id === user._id);
  }, [following, user._id]);

  const handleFollowAction = async () => {
    setIsProcessing(true);
    try {
      await handleFollow(user._id);
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnfollowAction = async () => {
    setIsProcessing(true);
    try {
      await handleUnfollow(user._id);
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        p: 1.5,
        borderBottom: "1px solid #2a2a2a",
        "&:hover": { backgroundColor: "#1e1e1e", cursor: "pointer" },
        transition: "background-color 0.2s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          minWidth: 0,
        }}
        onClick={() => window.open(`/${user.username}`, "_blank")}
      >
        <Avatar
          src={user.profileImage}
          alt={user.username}
          sx={{ width: 40, height: 40 }}
        />

        <Box sx={{ minWidth: 0 }}>
          <Typography color="whitesmoke" noWrap sx={{ fontWeight: 500 }}>
            {user.username}
          </Typography>
          <Typography color="text.secondary" fontSize="0.8rem" noWrap>
            {user.fullname}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Tooltip title="Send message">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleMessage(user._id);
            }}
            disabled={isProcessing}
          >
            <SendIcon sx={{ color: "whitesmoke" }} />
          </IconButton>
        </Tooltip>

        {isFollowing ? (
          <Tooltip title="Unfollow">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleUnfollowAction();
              }}
              disabled={isProcessing}
            >
              <PersonRemoveAlt1Icon sx={{ color: "error.main" }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Follow">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleFollowAction();
              }}
              disabled={isProcessing}
            >
              <PersonAddAlt1Icon sx={{ color: "success.main" }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default SearchList;
