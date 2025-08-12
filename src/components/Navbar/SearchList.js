import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMemo, useState } from "react";
import useConnections from "../../hooks/useConnections";
import useUser from "../../hooks/useUser";

const SearchList = ({ res, handleMessage, handleFollow, handleUnfollow }) => {
  const { data: user } = useUser();
  const { data: following = [] } = useConnections(user._id, "following");

  const [isProcessing, setIsProcessing] = useState(false);

  const isFollowing = useMemo(() => {
    return following?.some((u) => u._id === res._id);
  }, [following, res._id]);

  const handleFollowAction = async () => {
    setIsProcessing(true);
    try {
      await handleFollow(res._id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnfollowAction = async () => {
    setIsProcessing(true);
    try {
      await handleUnfollow(res._id);
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
        p: 1.5,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        transition: "background-color 0.25s ease",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
      }}
    >
      {/* Left: User Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minWidth: 0,
        }}
        onClick={() => window.open(`/${res.username}`, "_blank")}
      >
        <Avatar
          src={res.profileImage}
          alt={res.username}
          sx={{
            width: 44,
            height: 44,
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.06)" },
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{ fontWeight: 600, color: "#d900ffff" }}
          >
            {res.username}
          </Typography>
          <Typography
            variant="body2"
            noWrap
            sx={{ color: "whitesmoke", fontSize: "0.82rem" }}
          >
            {res.fullname}
          </Typography>
        </Box>
      </Box>

      {/* Right: Actions */}
      <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
        <Tooltip title="Send message">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMessage(res._id);
            }}
            disabled={isProcessing}
          >
            <SendIcon sx={{ color: "whitesmoke" }} fontSize="small" />
          </IconButton>
        </Tooltip>

        {isFollowing ? (
          <Tooltip title="Unfollow">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleUnfollowAction();
              }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <CircularProgress size={20} color="error" />
              ) : (
                <PersonRemoveAlt1Icon sx={{ color: "error.main" }} />
              )}
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Follow">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleFollowAction();
              }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <CircularProgress size={20} color="success" />
              ) : (
                <PersonAddAlt1Icon sx={{ color: "success.main" }} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default SearchList;
