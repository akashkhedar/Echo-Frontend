import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { Box, Grid, IconButton, Paper, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../utils/socket";
import {
  acceptCall,
  closeConnection,
  connectionClosed,
  getIceCandidate,
  getNewAnswer,
  getNewOffer,
  makeCall,
  setRemoteDsp,
  toggleCamera,
  toggleMic,
} from "../../utils/webRTC";

const VideoCallPage = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const hasCalledRef = useRef(false);
  const userId = useSelector((state) => state.user._id);

  const { state } = useLocation();
  const { callerId, calleeId, offer, type } = state || {};

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("getAnswer", async (answer) => {
      await setRemoteDsp(answer);
    });

    socket.on("getIceCandidate", async ({ candidate }) => {
      await getIceCandidate(candidate);
    });

    const initPeerConnection = async () => {
      if (type === "audio") {
        setCameraOn(false);
      }

      try {
        if (!hasCalledRef.current) {
          hasCalledRef.current = true;
          console.log(socket.id);
          if (userId === callerId) {
            await makeCall(
              callerId,
              calleeId,
              type,
              localVideoRef,
              remoteVideoRef
            );
          } else {
            await acceptCall(
              calleeId,
              callerId,
              offer,
              type,
              localVideoRef,
              remoteVideoRef
            );
          }
        }
      } catch (error) {
        console.error("Error initializing peer connection:", error);
      }
    };

    initPeerConnection();

    socket.on("callEnded", () => {
      connectionClosed();
      navigate("/chat");
    });

    socket.on("getNewOffer", async ({ sender, receiver, newOffer }) => {
      await getNewOffer(sender, receiver, newOffer);
    });

    socket.on("getNewAnswer", async (answer) => {
      await getNewAnswer(answer);
    });

    return () => {
      socket.off("getAnswer");
      socket.off("getIceCandidate");
      socket.off("getNewOffer");
      socket.off("getNewAnswer");
      closeConnection(calleeId);
    };
  }, []);

  const endCall = () => {
    closeConnection(calleeId);
    navigate("/chat");
  };

  const handleMic = async () => {
    setMicOn((prev) => !prev);
    await toggleMic();
  };

  const handleCamera = async () => {
    let receiver;
    setCameraOn((prev) => !prev);
    if (userId !== calleeId) {
      receiver = calleeId;
    } else {
      receiver = callerId;
    }
    await toggleCamera({
      sender: userId,
      receiver: receiver,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "99.999vh",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <Grid container sx={{ width: "100%", height: "100%" }}>
        <Grid
          item
          xs={12}
          sx={{
            position: "relative",
            height: "100%",
            border: "1px solid white",
          }}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />

          <Paper
            elevation={5}
            sx={{
              position: "absolute",
              bottom: 20,
              right: 16,
              width: 200,
              height: 120,
              overflow: "hidden",
              borderRadius: 2,
              backgroundColor: "#000",
              border: "1px solid white",
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
              }}
            />
          </Paper>

          {/* --- Controls --- */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 4,
              px: 3,
              py: 1,
            }}
          >
            <IconButton
              onClick={handleMic}
              sx={{
                color: micOn ? "#fff" : "#f44336",
              }}
            >
              {micOn ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            <IconButton
              onClick={handleCamera}
              sx={{
                color: cameraOn ? "#fff" : "#f44336",
              }}
            >
              {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>

            <IconButton
              onClick={endCall}
              sx={{
                color: "#fff",
                backgroundColor: "#f44336",
                "&:hover": {
                  backgroundColor: "#d32f2f",
                },
              }}
            >
              <CallEndIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoCallPage;
