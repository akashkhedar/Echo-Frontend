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
  video: false,
  audio: true,
};

const initPeerConnection = async (callerId, calleeId, type) => {
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

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

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
    await peerConnection.setLocalDescription(offer);

    socket.emit("sendOffer", {
      callerId,
      calleeId,
      offer,
      type,
    });

    return { localStream, remoteStream };
  } catch (error) {
    console.error("Error in makeCall:", error);
    return { localStream: null, remoteStream: null };
  }
};

export const acceptCall = async (callerId, calleeId, offer, type) => {
  try {
    await initPeerConnection(callerId, calleeId, type);

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("sendAnswer", {
      callerId,
      calleeId,
      answer,
    });

    return { localStream, remoteStream };
  } catch (error) {
    console.error("Error in acceptCall:", error);
    return { localStream: null, remoteStream: null };
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
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  isRemoteDescriptionSet = true;

  for (const candidate of candidateQueue) {
    await peerConnection.addIceCandidate(candidate);
  }
  candidateQueue = [];
};

export const peerNegotiation = async (sender, receiver) => {
  peerConnection.onnegotiationneeded = async () => {
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
    const videoTrack = localStream.getVideoTracks()[0];
    peerConnection.getSenders().forEach((sender) => {
      if (sender.track === videoTrack) {
        peerConnection.removeTrack(sender);
      }
    });
    localStream.getVideoTracks()[0].enabled = videoStream;
    localStream.removeTrack(videoTrack);
    videoTrack.stop();
    await peerNegotiation(sender, receiver);
    return;
  }
  if ((localStream != null) & (localStream.getVideoTracks().length === 0)) {
    console.log("enabled");
    const videoTrack = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoTrack.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
      localStream.addTrack(track);
    });
    await peerNegotiation(sender, receiver);
    videoStream = !videoStream;
    return;
  }
};

export const getNewOffer = async (sender, receiver, newOffer) => {
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
};

export const getNewAnswer = async (answer) => {
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
