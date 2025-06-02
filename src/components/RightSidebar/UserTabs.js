import {
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import useConversationSelection from "../../hooks/useConversationSelection";

const UserTabs = ({ conversation, handleOpen, key }) => {
  const { _id } = useSelector((state) => state.user);
  const handleConversationSelection = useConversationSelection();
  return (
    <React.Fragment key={key}>
      <ListItem
        onClick={() => {
          handleOpen();
          handleConversationSelection(conversation, _id);
        }}
        disablePadding
        sx={{ marginY: "0.5rem" }}
      >
        <ListItemButton sx={{ display: "flex", gap: 2 }}>
          <Avatar
            src={conversation.user.profileImage}
            alt={conversation.user.username}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <ListItemText
              primary={conversation.user.username}
              sx={{
                display: { xs: "none", md: "block" }, // Hide names on small screens
                color: "whitesmoke",
                mt: -0.3,
              }}
            />
          </Box>
        </ListItemButton>
      </ListItem>
    </React.Fragment>
  );
};

export default UserTabs;
