import socket from "./socket";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let localStream;
let remoteStream;

let peerConnection;

let constraints = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
  },
  audio: true,
};

const initPeerConnection = async (callerId, calleeId) => {
  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
  }

  if (!peerConnection) {
    peerConnection = new RTCPeerConnection(configuration);
  }

  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("sendIceCandidate", {
        candidate: event.candidate,
        callerId,
        calleeId,
      });
    }
  };
};

export const makeCall = async (callerId, calleeId) => {
  try {
    await initPeerConnection(callerId, calleeId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("sendOffer", {
      callerId,
      calleeId,
      offer,
    });
    console.log("offer sent");
    return { localStream: localStream, remoteStream: remoteStream };
  } catch (error) {
    console.log(error);
  }
};

export const acceptCall = async (callerId, calleeId, offer) => {
  try {
    await initPeerConnection(callerId, calleeId);
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("sendAnswer", {
      callerId,
      calleeId,
      answer,
    });
    console.log("answer sent");
  } catch (error) {
    console.log(error);
  }
};

export const getIceCandidate = async (candidate) => {
  console.log("candidate received");
  try {
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate);
    }
  } catch (error) {
    console.log(error);
  }
};

export const setRemoteDsp = async (answer) => {
  console.log("answer received");
  if (!peerConnection.currentRemoteDescription) {
    peerConnection.setRemoteDescription(answer);
  }
};

export const closeConnection = () => {
  if (peerConnection && peerConnection.connectionState !== "closed") {
    peerConnection.close();
    peerConnection = null;
    peerConnection.onicecandidate = null;
    peerConnection.onconnectionstatechange = null;
  }
};
