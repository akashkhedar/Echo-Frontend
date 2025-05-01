import { Box, Grid, Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  acceptCall,
  getIceCandidate,
  makeCall,
  setRemoteDsp,
} from "../../utils/webRTC";
import socket from "../../utils/socket";

const VideoCallPage = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const userId = useSelector((state) => state.user._id);

  const { state } = useLocation();
  const { callerId, calleeId, offer } = state || {};

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
      try {
        if (userId === callerId) {
          const { localStream, remoteStream } = await makeCall(
            callerId,
            calleeId
          );
          if (localStream && remoteStream) {
            localVideoRef.current.srcObject = localStream;
            remoteVideoRef.current.srcObject = remoteStream;
          }
        } else {
          const { localStream, remoteStream } = await acceptCall(
            calleeId,
            callerId,
            offer
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

    return () => {
      socket.off("getAnswer");
      socket.off("getIceCandidate");
    };
  }, [callerId, calleeId, offer, userId]);

  return (
    <Box
      sx={{
        width: "100%%",
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoCallPage;
