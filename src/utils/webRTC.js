import socket from "./socket";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let localStream;
let remoteStream;
let videoStream = true;
let audioStream = true;

let peerConnection;

let candidateQueue = [];
let isRemoteDescriptionSet = false;

let videoCall = {
  video: true,
  audio: true,
};

let audioCall = {
  video: true,
  audio: true,
};

const initPeerConnection = async (callerId, calleeId, type) => {
  if (type === "videoCall") {
    localStream = await navigator.mediaDevices.getUserMedia(videoCall);
  } else {
    localStream = await navigator.mediaDevices.getUserMedia(audioCall);
  }
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

export const makeCall = async (callerId, calleeId, type) => {
  try {
    await initPeerConnection(callerId, calleeId, type);
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

export const toggleMic = async () => {
  if ((localStream != null) & (localStream.getAudioTracks().length > 0)) {
    audioStream = !audioStream;
    localStream.getAudioTracks()[0].enabled = audioStream;
  }
};

export const toggleCamera = async () => {
  if ((localStream != null) & (localStream.getVideoTracks().length > 0)) {
    videoStream = !videoStream;
    localStream.getVideoTracks()[0].enabled = videoStream;
  }
};

export const closeConnection = (callee) => {
  if (peerConnection && peerConnection.connectionState !== "closed") {
    socket.emit("endCall", callee);
    peerConnection.onicecandidate = null;
    peerConnection.onconnectionstatechange = null;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    peerConnection.close();
    peerConnection = null;
  }
};

export const connectionClosed = () => {
  if (peerConnection && peerConnection.connectionState !== "closed") {
    peerConnection.onicecandidate = null;
    peerConnection.onconnectionstatechange = null;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    peerConnection.close();
    peerConnection = null;
  }
};
