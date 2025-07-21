import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
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
import notify from "./NotifyMsg";
import LGQuickChat from "./RightSidebar/LGQuickChat";
import MDQuickChat from "./RightSidebar/MDQuickChat";
import { selectConversations } from "../redux/selectors/unreadSelector";
import { useSnackbar } from "notistack";
import NotifyCall from "./NotifyCall";
import NotifyMsg from "./NotifyMsg";

const HomeLayout = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        socket.emit("joinChat", userId);
        const res = await axiosInstance.get("/chat/list");
        console.log(res.data);
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
      enqueueSnackbar(
        (key) => (
          <NotifyCall
            callerId={callerId}
            callerName={callerName}
            type={type}
            handleAcceptCall={() => {
              handleAcceptCall();
              enqueueSnackbar("Call accepted", { variant: "success" });
            }}
            handleDeclineCall={() => {
              handleDeclineCall();
              enqueueSnackbar("Call declined", { variant: "error" });
            }}
            socket={socket}
            enqueueSnackbar={enqueueSnackbar}
          />
        ),
        { persist: true }
      );
    });

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
    const handleAcceptCall = async (callerId, calleeId, type) => {
      socket.emit("acceptedCall", {
        callerId,
        calleeId,
        type,
      });
    };

    const handleDeclineCall = (sender) => {
      socket.emit("declinedCall", {
        sender: userId,
        receiver: sender,
      });
    };

    return () => {
      socket.off("receiveMsg");
      socket.off("notify");
      socket.off("newConvo");
      socket.off("redirectConvo");
      socket.off("getOffer");
      socket.off("receiveCall");
      socket.off("onCallAccept");
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
  ]);

  return verified ? (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "4rem auto",
        gridTemplateColumns: "auto",
        height: "100vh",
        width: "100vw",
        background: "#181818",
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
  ) : null;
};

export default HomeLayout;
