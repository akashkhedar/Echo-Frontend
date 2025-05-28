import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import axiosInstance from "../axiosInstance";
import useConversationSelection from "../hooks/useConversationSelection";
import { clearChat, setChat } from "../redux/slices/ChatSlice/ChatSlice";
import {
  markConversationUnread,
  setConversations,
} from "../redux/slices/ConversationSlice/ConversationSlice";
import socket from "../utils/socket";
import LGSidebar from "./LeftSidebar/LGSidebar";
import MDSidebar from "./LeftSidebar/MDSidebar";
import Navbar from "./Navbar/Navbar";
import notify from "./notify";
import LGQuickChat from "./RightSidebar/LGQuickChat";
import MDQuickChat from "./RightSidebar/MDQuickChat";

const HomeLayout = ({ children }) => {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectConversation = useConversationSelection();

  const chats = useSelector((state) => state.chat.chat);
  const userId = useSelector((state) => state.user._id);
  const currentOpenedChat = useSelector((state) => state.chat.chatId);
  const convo = useSelector((state) => state.convo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        socket.emit("joinChat", userId);
        const res = await axiosInstance.get("/chat/list");
        dispatch(setConversations(res.data));
        const rooms = res.data.map((convo) => convo.roomId);
        socket.emit("joinAllRooms", rooms);
      } catch (error) {
        console.log(error);
      }
    };

    const handleConnect = async () => {
      await fetchData();
    };

    const handleBeforeUnload = () => {
      socket.emit("leaveChat", userId);
    };

    socket.on("connect", handleConnect);

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      dispatch(clearChat());
      socket.off("connect", handleConnect);
      socket.off("leaveChat");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch, userId]);

  useEffect(() => {
    socket.on("receiveMsg", (message, username) => {
      if (message.conversationId === currentOpenedChat) {
        dispatch(setChat([...chats, message]));
        return;
      }
      if (
        message.conversationId !== currentOpenedChat &&
        message.sender !== userId
      ) {
        dispatch(markConversationUnread(message.conversationId));
        notify(username);
        socket.emit("offlineMessage", message.receiver, message.conversationId);
        return;
      }
    });

    socket.on("notify", (sender) => {
      notify(sender, "message");
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
      notify(
        callerName,

        "call",
        () => handleAcceptCall(callerId, calleeId, type),
        () => handleDeclineCall(calleeId, callerId),
        type,
        callerName
      );
    });

    const handleAcceptCall = async (callerId, calleeId, type) => {
      socket.emit("acceptedCall", {
        callerId,
        calleeId,
        type,
      });
    };

    socket.on("onCallAccept", ({ callerId, calleeId, type }) => {
      navigate("/call", {
        state: { callerId: callerId, calleeId: calleeId, type: type },
      });
    });

    const handleDeclineCall = (sender) => {
      socket.emit("declinedCall", {
        sender: userId,
        receiver: sender,
      });
    };

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
    };
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "4rem auto",
        gridTemplateColumns: "auto",
        height: "100vh",
        width: "100vw",
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
          background: "#181818",
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
        <Box
          sx={{
            width: { md: "4rem", lg: "13rem" },
            background: "#181818",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block", lg: "none" } }}>
            <MDSidebar />
          </Box>
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <LGSidebar />
          </Box>
        </Box>

        {/* Main Content */}

        <Box
          component="main"
          sx={{
            flex: 1,
            paddingRight: { md: "1rem", lg: "2rem" },
            paddingLeft: { md: "1rem", lg: "1rem" },
            background: "#181818",
          }}
        >
          {children}
        </Box>

        {!isChatPage && (
          <Box
            sx={{
              width: { md: "4rem", lg: "13rem" },
              background: "#181818",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: { xs: "none", md: "block", lg: "none" } }}>
              <MDQuickChat />
            </Box>
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <LGQuickChat />
            </Box>
          </Box>
        )}
      </Box>
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Flip}
      />
    </Box>
  );
};

export default HomeLayout;
