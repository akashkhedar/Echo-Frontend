import { Box, Grid, Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { makeCall } from "../../utils/webRTC";

const VideoCallPage = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const userId = useSelector((state) => state.user._id);

  const { state } = useLocation();
  const { callerId, calleeId } = state || {};

  useEffect(() => {
    const initPeerConnection = async () => {
      if (userId === callerId) {
        let { localStream, remoteStream } = await makeCall(callerId, calleeId);
        localVideoRef.current.srcObject = localStream;
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    initPeerConnection();
  });

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
