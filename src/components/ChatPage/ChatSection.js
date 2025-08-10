import { Box, styled } from "@mui/material";
import useSelectedChatUser from "../../hooks/useSelectedChatUser";
import EmptyChat from "./EmptyChat";
import Messages from "./Messages";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  color: "whitesmoke",
  flexGrow: 1,
  overflowY: "auto",
  height: "100%",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
  "-ms-overflow-style": "none",
  flex: 1,
  overflow: "hidden",
  width: "100%",
}));

const ChatSection = () => {
  const { conversation } = useSelectedChatUser();

  return (
    <StyledBox>{!conversation._id ? <EmptyChat /> : <Messages />}</StyledBox>
  );
};

export default ChatSection;
