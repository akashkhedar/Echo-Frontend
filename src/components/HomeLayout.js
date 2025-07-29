import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import useConversationSelection from "../hooks/useConversationSelection";
import { selectConversations } from "../redux/selectors/unreadSelector";
import { clearChat, setChat } from "../redux/slices/ChatSlice/ChatSlice";
import { setConversations } from "../redux/slices/ConversationSlice/ConversationSlice";
import socket from "../utils/socket";
import SimpleBottomNavigation from "./BottomNavigation/BottomNavigation";
import LGSidebar from "./LeftSidebar/LGSidebar";
import MDSidebar from "./LeftSidebar/MDSidebar";
import Navbar from "./Navbar/Navbar";
import NotifyCall from "./NotifyCall";
import NotifyMessage, { default as NotifyMsg } from "./NotifyMessage";
import LGQuickChat from "./RightSidebar/LGQuickChat";
import MDQuickChat from "./RightSidebar/MDQuickChat";

const HomeLayout = ({ children }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectConversation = useConversationSelection();

  const chats = useSelector((state) => state.chat.chat);
  const userId = useSelector((state) => state.user._id);
  const currentOpenedChat = useSelector((state) => state.chat.chatId);
  const convo = useSelector(selectConversations);

  const [verified, setVerified] = useState(false);

  const [currentCallSnackbarKey, setCurrentCallSnackbarKey] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        socket.emit("joinChat", userId);
        const res = await axiosInstance.get("/chat/list");
        dispatch(setConversations(res.data));
        const rooms = res.data.map((convo) => convo.roomId);
        socket.emit("joinAllRooms", rooms);
        setVerified(true);
      } catch (error) {
        if (error.status === 401) {
          navigate("/signup");
        }
      }
    };

    fetchData();

    const handleBeforeUnload = () => {
      socket.emit("leaveChat", userId);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      dispatch(clearChat());
      socket.off("leaveChat");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch, navigate, userId]);

  useEffect(() => {
    socket.on("receiveMsg", (message, username) => {
      if (message.conversationId === currentOpenedChat) {
        dispatch(setChat([...chats, message]));
        return;
      }
      const key = enqueueSnackbar("", {
        persist: true,
        content: (key) => (
          <NotifyMessage
            username={username}
            closeSnackbar={closeSnackbar}
            snackbarKey={key}
          />
        ),
      });

      setTimeout(() => {
        closeSnackbar(key);
      }, 1500);

      socket.emit("offlineMessage", message.receiver, message.conversationId);
    });

    socket.on("notify", (sender) => {
      enqueueSnackbar((key) => <NotifyMsg sender={sender} />, {
        variant: "info",
      });
    });

    socket.on("redirectConvo", (id) => {
      const selectedConvo = convo.find((c) => c._id === id);
      selectConversation(selectedConvo, userId);
      navigate("/chat");
    });

    socket.on("newConvo", (newConvo) => {
      dispatch(setConversations([...convo, newConvo]));
      selectConversation(newConvo, userId);
      navigate("/chat");
    });

    socket.on("receiveCall", ({ callerName, callerId, calleeId, type }) => {
      const key = enqueueSnackbar("", {
        persist: true,
        content: (key) => (
          <NotifyCall
            callerId={callerId}
            callerName={callerName}
            type={type}
            handleAcceptCall={() => {
              socket.emit("acceptedCall", {
                callerId,
                calleeId,
                type,
              });
              closeSnackbar(key);
            }}
            handleDeclineCall={() => {
              socket.emit("declinedCall", {
                callerId,
              });
              closeSnackbar(key);
            }}
            closeSnackbar={closeSnackbar}
            socket={socket}
            snackbarKey={key}
          />
        ),
      });

      setCurrentCallSnackbarKey(key);

      setTimeout(() => {
        closeSnackbar(key);
        socket.emit("declinedCall", {
          callerId,
        });
      }, 30000);
    });

    const cancelCallHandler = () => {
      if (currentCallSnackbarKey) {
        closeSnackbar(currentCallSnackbarKey);
      }

      enqueueSnackbar(`📴 Call cancelled by the caller`, {
        variant: "info",
      });
    };

    socket.on("cancelledCall", cancelCallHandler);

    socket.on("onCallAccept", ({ callerId, calleeId, type }) => {
      navigate("/call", {
        state: { callerId: callerId, calleeId: calleeId, type: type },
      });
    });

    socket.on("getOffer", async ({ callerId, calleeId, offer, type }) => {
      navigate("/call", {
        state: {
          callerId: callerId,
          calleeId: calleeId,
          offer: offer,
          type: type,
        },
      });
    });

    return () => {
      socket.off("receiveMsg");
      socket.off("notify");
      socket.off("newConvo");
      socket.off("redirectConvo");
      socket.off("getOffer");
      socket.off("receiveCall");
      socket.off("onCallAccept");
      socket.off("cancelledCall", cancelCallHandler);
    };
  }, [
    currentOpenedChat,
    userId,
    convo,
    dispatch,
    chats,
    selectConversation,
    navigate,
    enqueueSnackbar,
    closeSnackbar,
    currentCallSnackbarKey,
  ]);

  return verified ? (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "4rem auto",
        height: "100vh",
        width: "100vw",
        background: "#181818",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        overflowY: "auto",
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          gridRow: "1 / 2",
          gridColumn: "1 / 2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Navbar />
      </Box>

      {/* Sidebar and Post Section */}
      <Box
        sx={{
          gridRow: "2 / 3",
          gridColumn: "1 / 2",
          display: "flex",
          flexDirection: "row",
          height: "100%",
        }}
      >
        {/* Sidebar */}
        {!isMobile ? (
          <Box
            sx={{
              width: {
                sm: "5rem",
                lg: "14rem",
              },
              background: "#181818",
            }}
          >
            {isTablet ? <MDSidebar /> : <LGSidebar />}
          </Box>
        ) : null}

        {/* Main Content */}

        <Box
          component="main"
          sx={{
            flex: 1,
            background: "#181818",
            minHeight: "100v%",
            width: "100%",
            mx: "auto",
          }}
        >
          {children}
        </Box>

        {!isChatPage && !isMobile ? (
          <Box
            sx={{
              width: { sm: "5rem", lg: "14rem" },
              background: "#181818",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {isTablet ? <MDQuickChat /> : <LGQuickChat />}
          </Box>
        ) : null}
      </Box>
      {isMobile && <SimpleBottomNavigation />}
    </Box>
  ) : null;
};

export default HomeLayout;
