import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useConversationList from "../hooks/useConversationList";
import useConversationSelection from "../hooks/useConversationSelection";
import useSelectedChatUser from "../hooks/useSelectedChatUser";
import useUser from "../hooks/useUser";
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
  const { data: user, isError } = useUser();
  useEffect(() => {
    if (!user) {
      return;
    }
  });

  const navigate = useNavigate();

  if (isError) {
    navigate("/login");
  }
  const queryClient = useQueryClient();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  const selectConversation = useConversationSelection();

  const { conversation, clearConversation } = useSelectedChatUser();

  const { data: conversations } = useConversationList(user?._id);

  const [verified, setVerified] = useState(false);

  const [currentCallSnackbarKey, setCurrentCallSnackbarKey] = useState(null);

  useEffect(() => {
    const joinRooms = async () => {
      try {
        socket.emit("joinChat", user?._id);

        const rooms = conversations?.map((convo) => convo.roomId) || [];
        socket.emit("joinAllRooms", rooms);
        setVerified(true);
      } catch (error) {
        if (error.status === 401) {
          navigate("/signup");
        }
      }
    };

    if (conversations) {
      joinRooms();
    }

    // return () => {
    //   clearConversation();
    // };
  }, [clearConversation, conversations, navigate, user?._id]);

  useEffect(() => {
    socket.on("userOnline", (id) => {
      queryClient.setQueryData(["conversations", user?._id], (old) =>
        old?.map((convo) =>
          convo?.user?._id === id
            ? { ...convo, user: { ...convo.user, isOnline: true } }
            : convo
        )
      );
    });

    socket.on("userOffline", (id) => {
      queryClient.setQueryData(["conversations", user?._id], (old) =>
        old?.map((convo) =>
          convo.user?._id === id
            ? { ...convo, user: { ...convo.user, isOnline: false } }
            : convo
        )
      );
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [queryClient, user?._id]);

  useEffect(() => {
    const handler = (message, username) => {
      if (message.conversationId === conversation?._id) {
        queryClient.setQueryData(
          ["messages", conversation?._id],
          (oldMessages) => {
            if (!oldMessages) return [message];

            if (oldMessages.some((m) => m?._id === message?._id))
              return oldMessages;
            return [...oldMessages, message];
          }
        );
      }

      if (message.conversationId !== conversation?._id) {
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
        queryClient.setQueryData(["conversations", user?._id], (old) => {
          if (!old) return [];
          return old.map((convo) =>
            convo?._id === message.conversationId
              ? { ...convo, unread: true }
              : convo
          );
        });

        socket.emit("offlineMessage", message.receiver, message.conversationId);
      }
    };

    socket.on("receiveMsg", handler);

    const handleReceiverRead = (msgId) => {
      queryClient.setQueriesData(
        { predicate: (query) => query.queryKey[0] === "messages" },
        (old) => {
          return old.map((msg) =>
            msg?._id === msgId ? { ...msg, read: true } : msg
          );
        }
      );
    };

    socket.on("receiverRead", handleReceiverRead);

    socket.on("notify", (sender) => {
      enqueueSnackbar((key) => <NotifyMsg sender={sender} />, {
        variant: "info",
      });
    });

    socket.on("redirectConvo", (id) => {
      const selectedConvo = conversations.find((c) => c?._id === id);
      selectConversation(selectedConvo, user?._id);
      navigate("/chat");
    });

    socket.on("newConvo", (newConvo) => {
      queryClient.setQueryData(["conversations", user?._id], (old = []) => {
        const exists = old.some((c) => c?._id === newConvo?._id);
        return exists ? old : [newConvo, ...old];
      });

      selectConversation(newConvo, user?._id);
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
      socket.off("receiverRead");
      socket.off("onCallAccept");
      socket.off("cancelledCall", cancelCallHandler);
    };
  }, [
    conversation?._id,
    user?._id,
    selectConversation,
    navigate,
    enqueueSnackbar,
    closeSnackbar,
    currentCallSnackbarKey,
    conversations,
    queryClient,
  ]);

  return verified ? (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "4rem auto",
        height: "100vh",
        width: "100vw",
        background: "#0f0f17ff",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Navbar />
      </Box>

      {/* Content Row */}
      <Box
        sx={{
          gridRow: "2 / 3",
          display: "grid",
          gap: 2,
          gridTemplateColumns: !isMobile
            ? isChatPage
              ? { sm: "5rem minmax(0, 1fr)", lg: "14rem minmax(0, 1fr)" }
              : {
                  sm: "5rem minmax(0, 1fr) 5rem",
                  lg: "14rem minmax(0, 1fr) 14rem",
                }
            : "minmax(0, 1fr)",
          maxWidth: "100%",
        }}
      >
        {/* Left Sidebar */}
        {!isMobile && (
          <Box sx={{ width: isTablet ? "5rem" : "14rem", flexShrink: 0 }}>
            {isTablet ? <MDSidebar /> : <LGSidebar />}
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            height: "100%",
            width: "100%",
            maxWidth: "100%",

            pb: isMobile ? "56px" : 0,
          }}
        >
          {children}
        </Box>

        {/* Right Sidebar */}
        {!isChatPage && !isMobile && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: isTablet ? "5rem" : "14rem",
              flexShrink: 0,
            }}
          >
            {isTablet ? <MDQuickChat /> : <LGQuickChat />}
          </Box>
        )}
      </Box>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && <SimpleBottomNavigation />}
    </Box>
  ) : null;
};

export default HomeLayout;
