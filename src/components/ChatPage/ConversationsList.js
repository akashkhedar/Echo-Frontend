import {
  Avatar,
  Badge,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

const ConversationsList = ({ conversation, selectedChat, handleClick }) => {
  return (
    <ListItem
      key={conversation._id}
      onClick={() => handleClick(conversation)}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px 15px",
        borderRadius: 2,
        backgroundColor:
          selectedChat === conversation._id ? "#2E2E48" : "transparent",
        cursor: "pointer",
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ListItemAvatar>
          <Badge color="success" variant="dot">
            <Avatar
              src={`${conversation.user.profileImage}`}
              alt={`${conversation.user.fullname}`}
            />
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={`${conversation.user.fullname}`}
          secondary={
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
              {conversation._id === 0 ? "Are you here?" : "Last message..."}
            </Typography>
          }
          sx={{ color: "whitesmoke" }}
        />
      </Box>

      {conversation.unread && (
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "rgb(99, 31, 108)",
            marginLeft: "8px",
          }}
        />
      )}
    </ListItem>
  );
};

export default ConversationsList;
