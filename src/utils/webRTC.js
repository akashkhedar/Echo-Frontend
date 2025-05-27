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
let isLocalDescriptionSet = false;

let videoCall = {
  video: true,
  audio: true,
};

let audioCall = {
  video: false,
  audio: true,
};

const initPeerConnection = async (
  callerId,
  calleeId,
  type,
  localVideoRef,
  remoteVideoRef
) => {
  if (type === "video") {
    localStream = await navigator.mediaDevices.getUserMedia(videoCall);
  } else {
    localStream = await navigator.mediaDevices.getUserMedia(audioCall);
    videoStream = false;
  }

  peerConnection = new RTCPeerConnection(configuration);
  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
  if (localVideoRef?.current) {
    localVideoRef.current.srcObject = localStream;
  }
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  if (remoteVideoRef?.current) {
    remoteVideoRef.current.srcObject = remoteStream;
  }
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

export const makeCall = async (
  callerId,
  calleeId,
  type,
  localVideoRef,
  remoteVideoRef
) => {
  try {
    if (isLocalDescriptionSet) {
      console.log("already set");
      return;
    }
    await initPeerConnection(
      callerId,
      calleeId,
      type,
      localVideoRef,
      remoteVideoRef
    );
    if (peerConnection.signalingState !== "stable") {
      console.warn("Signaling state not stable, skipping new offer.");
      return;
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    isLocalDescriptionSet = true;
    console.log(offer);
    socket.emit("sendOffer", {
      callerId,
      calleeId,
      offer,
      type,
    });

    return;
  } catch (error) {
    console.error("Error in makeCall:", error);
  }
};

export const acceptCall = async (
  callerId,
  calleeId,
  offer,
  type,
  localVideoRef,
  remoteVideoRef
) => {
  try {
    await initPeerConnection(
      callerId,
      calleeId,
      type,
      localVideoRef,
      remoteVideoRef
    );

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    isRemoteDescriptionSet = true;
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    isLocalDescriptionSet = true;
    socket.emit("sendAnswer", {
      callerId,
      calleeId,
      answer,
    });
    return;
  } catch (error) {
    console.error("Error in acceptCall:", error);
    return;
  }
};

export const getIceCandidate = async (candidate) => {
  try {
    if (peerConnection) {
      if (isRemoteDescriptionSet) {
        await peerConnection.addIceCandidate(candidate);
      } else {
        candidateQueue.push(candidate);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const setRemoteDsp = async (answer) => {
  console.log(answer);
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  isRemoteDescriptionSet = true;

  for (const candidate of candidateQueue) {
    await peerConnection.addIceCandidate(candidate);
  }
  candidateQueue = [];
};

export const peerNegotiation = async (sender, receiver) => {
  try {
    const newOffer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(newOffer);

    socket.emit("sendNewOffer", {
      sender,
      receiver,
      newOffer,
    });
  } catch (e) {
    console.error("Renegotiation failed:", e);
  }
};

export const toggleMic = async () => {
  if ((localStream != null) & (localStream.getAudioTracks().length > 0)) {
    audioStream = !audioStream;
    localStream.getAudioTracks()[0].enabled = audioStream;
  }
};

export const toggleCamera = async ({ sender, receiver }) => {
  if ((localStream != null) & (localStream.getVideoTracks().length > 0)) {
    console.log("disabled");
    const videoTrack = await localStream.getVideoTracks()[0];
    videoTrack.stop();
    localStream.removeTrack(videoTrack);
    const senderToRemove = peerConnection
      .getSenders()
      .find((s) => s.track === videoTrack);
    if (senderToRemove) {
      peerConnection.removeTrack(senderToRemove);
    }
    await peerNegotiation(sender, receiver);
    videoStream = !videoStream;
    return;
  }
  if ((localStream != null) & (localStream.getVideoTracks().length === 0)) {
    console.log("enabled");
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const videoTrack = newStream.getVideoTracks()[0];
    localStream.addTrack(videoTrack);

    // Add to peerConnection
    peerConnection.addTrack(videoTrack, localStream);
    await peerNegotiation(sender, receiver);
    videoStream = !videoStream;
    return;
  }
};

export const getNewOffer = async (sender, receiver, newOffer) => {
  console.log(newOffer);
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(newOffer)
  );
  const newAnswer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(newAnswer);
  socket.emit("sendNewAnswer", {
    sender: receiver,
    receiver: sender,
    answer: newAnswer,
  });

  const remoteStream = new MediaStream();
  peerConnection.getReceivers().forEach((receiver) => {
    if (receiver.track) {
      remoteStream.addTrack(receiver.track);
    }
  });

  return;
};

export const getNewAnswer = async (answer) => {
  console.log(answer);
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  isRemoteDescriptionSet = true;

  for (const candidate of candidateQueue) {
    await peerConnection.addIceCandidate(candidate);
  }
  candidateQueue = [];
};

export const closeConnection = (callee) => {
  if (peerConnection && peerConnection.connectionState !== "closed") {
    socket.emit("endCall", callee);
    peerConnection.onicecandidate = null;
    peerConnection.onconnectionstatechange = null;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    isLocalDescriptionSet = false;
    isRemoteDescriptionSet = false;
    candidateQueue = [];
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
