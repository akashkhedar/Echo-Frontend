import {
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import React from "react";
import useConversationSelection from "../../hooks/useConversationSelection";
import useUser from "../../hooks/useUser";

const UserTabs = ({ conversation, handleOpen, key }) => {
  const { data: user } = useUser();

  const handleConversationSelection = useConversationSelection();
  return (
    <React.Fragment key={key}>
      <ListItem
        onClick={() => {
          handleOpen();
          handleConversationSelection(conversation, user._id);
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
