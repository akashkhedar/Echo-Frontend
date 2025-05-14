import { Box, Grid, Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  acceptCall,
  getIceCandidate,
  makeCall,
  setRemoteDsp,
  toggleMic,
  toggleCamera,
  closeConnection,
  connectionClosed,
  newOffer,
  newAnswer,
} from "../../utils/webRTC";
import socket from "../../utils/socket";
import { IconButton, Stack } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VideoCallPage = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const userId = useSelector((state) => state.user._id);

  const { state } = useLocation();
  const { callerId, calleeId, offer, type } = state || {};

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("getAnswer", async ({ callerId, calleeId, answer }) => {
      console.log("Received answer from callee");
      await setRemoteDsp(answer);
    });

    socket.on("getIceCandidate", async ({ candidate }) => {
      console.log("Received ice candidate");
      await getIceCandidate(candidate);
    });

    const initPeerConnection = async () => {
      if (type === "audio") {
        setCameraOn(false);
      }
      try {
        if (userId === callerId) {
          const { localStream, remoteStream } = await makeCall(
            callerId,
            calleeId,
            type
          );
          if (localStream && remoteStream) {
            localVideoRef.current.srcObject = localStream;
            remoteVideoRef.current.srcObject = remoteStream;
          }
        } else {
          const { localStream, remoteStream } = await acceptCall(
            calleeId,
            callerId,
            offer,
            type
          );
          if (localStream && remoteStream) {
            localVideoRef.current.srcObject = localStream;
            remoteVideoRef.current.srcObject = remoteStream;
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

    socket.on("getNewOffer", (callerId, calleeID,offer)=>{
      newOffer(callerId, calleeId, offer)
    })

    socket.on("getNewAnswer", (answer) => {
      newAnswer(answer);
    });

    return () => {
      socket.off("getAnswer");
      socket.off("getIceCandidate");
      socket.off("getNewOffer");
      socket.off("getNewAnswer")
      closeConnection(calleeId);
      navigate("/chat");
    };
  }, [callerId, calleeId, offer, userId, type, navigate]);

  const endCall = () => {
    closeConnection(calleeId);
    navigate("/chat");
  };

  const handleMic = async () => {
    setMicOn((prev) => !prev);
    await toggleMic();
  };

  const handleCamera = async () => {
    setCameraOn((prev) => !prev);
    await toggleCamera({callerId:userId,calleeId: });
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
