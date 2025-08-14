import {
  Avatar,
  Badge,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import useConversationSelection from "../../hooks/useConversationSelection";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
const ConversationsList = ({ conversation, selectedChat }) => {
  const { data: user } = useUser();

  const navigate = useNavigate();

  const selectConversation = useConversationSelection();
  const { saveConversation } = useSelectedChatUser();
  return (
    <ListItem
      key={conversation._id}
      onClick={async () => {
        saveConversation(conversation);
        await selectConversation(conversation, user._id);
        navigate("/chat");
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: { xs: "8px 12px", sm: "10px 15px" },
        fontSize: { xs: "0.8rem", sm: "1rem" },
        borderRadius: 2,
        backgroundColor:
          selectedChat === conversation._id ? "#181826ff" : "transparent",
        cursor: "pointer",
        justifyContent: "space-between",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ListItemAvatar>
          <Badge
            color={conversation.user.isOnline ? "success" : "default"}
            variant="dot"
          >
            <Avatar src={`${conversation.user.profileImage}`} alt={`user`} />
          </Badge>
        </ListItemAvatar>
        {/* {!isCollpased && ( */}
        <ListItemText
          primary={`${conversation.user.fullname}`}
          sx={{ color: "whitesmoke" }}
        />
        {/* )} */}
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
