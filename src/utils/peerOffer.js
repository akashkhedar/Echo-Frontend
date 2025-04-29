import socket from "./socket";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let remoteDescSet = false;
const candidateQueue = [];

let peerConnection;

const initPeerConnection = () => {
  remoteDescSet = false;
  candidateQueue.length = 0;

  peerConnection = new RTCPeerConnection(configuration);

  return peerConnection;
};

const applyQueuedCandidates = async () => {
  for (const c of candidateQueue) {
    await peerConnection.addIceCandidate(new RTCIceCandidate(c));
  }
  candidateQueue.length = 0;
};

const setupIceCandidateListener = (sender, receiver) => {
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("sendIceCandidate", {
        sender,
        receiver,
        candidate: event.candidate,
      });
    }
  };
};

export const makeCall = async (sender, receiver) => {
  try {
    initPeerConnection();
    setupIceCandidateListener(sender, receiver);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("sendOffer", {
      sender,
      receiver,
      offer,
    });
  } catch (error) {
    console.log(error);
  }
};

export const acceptCall = async (sender, receiver, offer) => {
  try {
    initPeerConnection();
    setupIceCandidateListener(sender, receiver);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    remoteDescSet = true;
    await applyQueuedCandidates();
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("sendAnswer", {
      sender,
      receiver,
      answer,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getIceCandidate = async (candidate) => {
  try {
    if (remoteDescSet) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      candidateQueue.push(candidate);
    }
  } catch (error) {
    console.log(error);
  }
};

export const setRemoteDsp = async (answer) => {
  try {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    remoteDescSet = true;
    await applyQueuedCandidates();
  } catch (error) {
    console.log(error);
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
