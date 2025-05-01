import socket from "./socket";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let localStream;
let remoteStream;

let peerConnection;

let candidateQueue = [];
let isRemoteDescriptionSet = false;

let constraints = {
  video: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
  },
  audio: true,
};

const initPeerConnection = async (callerId, calleeId) => {
  localStream = await navigator.mediaDevices.getUserMedia(constraints);

  peerConnection = new RTCPeerConnection(configuration);
  remoteStream = new MediaStream();

  // Add local stream tracks to the peer connection
  localStream.getTracks().forEach((track) => {
    console.log("Added local track");
    peerConnection.addTrack(track, localStream);
  });

  // When remote tracks are received, add them to the remote stream
  peerConnection.ontrack = (event) => {
    console.log("📡 Remote track received:", event.track);
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("sendIceCandidate", {
        callerId,
        calleeId,
        candidate: event.candidate,
      });
    }
  };
};

export const makeCall = async (callerId, calleeId) => {
  try {
    await initPeerConnection(callerId, calleeId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer); // This must happen after initializing peer connection

    socket.emit("sendOffer", {
      callerId,
      calleeId,
      offer,
    });

    return { localStream, remoteStream };
  } catch (error) {
    console.error("Error in makeCall:", error);
    return { localStream: null, remoteStream: null }; // Return null if error occurs
  }
};

export const acceptCall = async (callerId, calleeId, offer) => {
  try {
    await initPeerConnection(callerId, calleeId);
    // Set remote description only when an offer is received
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer); // After setting remote description

    socket.emit("sendAnswer", {
      callerId,
      calleeId,
      answer,
    });

    return { localStream, remoteStream };
  } catch (error) {
    console.error("Error in acceptCall:", error);
    return { localStream: null, remoteStream: null }; // Return null if error occurs
  }
};

export const getIceCandidate = async (candidate) => {
  try {
    if (peerConnection) {
      if (isRemoteDescriptionSet) {
        await peerConnection.addIceCandidate(candidate);
      } else {
        console.log("Queuing ICE candidate");
        candidateQueue.push(candidate);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const setRemoteDsp = async (answer) => {
  console.log("setting remote dsp");
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  isRemoteDescriptionSet = true;

  // Add any buffered ICE candidates
  for (const candidate of candidateQueue) {
    await peerConnection.addIceCandidate(candidate);
  }
  candidateQueue = []; // Clear queue
};

export const closeConnection = () => {
  if (peerConnection && peerConnection.connectionState !== "closed") {
    peerConnection.close();
    peerConnection = null;
    peerConnection.onicecandidate = null;
    peerConnection.onconnectionstatechange = null;
  }
};
