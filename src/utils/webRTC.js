import socket from "./socket";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let localStream;
let remoteStream;
let globalRemote;

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
  globalRemote = remoteVideoRef;
  if (type === "video") {
    localStream = await navigator.mediaDevices.getUserMedia(videoCall);
  } else {
    localStream = await navigator.mediaDevices.getUserMedia(audioCall);
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
    const kind = event.track.kind;

    remoteStream
      .getTracks()
      .filter((t) => t.kind === kind)
      .forEach((t) => remoteStream.removeTrack(t));

    remoteStream.addTrack(event.track);

    if (remoteVideoRef?.current) {
      remoteVideoRef.current.pause();
      remoteVideoRef.current.srcObject = null;

      remoteVideoRef.current.srcObject = remoteStream;
    }
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

export const makeCall = async (
  callerId,
  calleeId,
  type,
  localVideoRef,
  remoteVideoRef
) => {
  try {
    if (isLocalDescriptionSet) {
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
    if (peerConnection.localDescription) {
      isLocalDescriptionSet = true;
    }
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
    if (isLocalDescriptionSet & isRemoteDescriptionSet) {
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
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    if (peerConnection.remoteDescription) {
      isRemoteDescriptionSet = true;
    }
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    if (peerConnection.localDescription) {
      isLocalDescriptionSet = true;
    }
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
  if (isRemoteDescriptionSet) {
    return;
  }
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  if (peerConnection.remoteDescription) {
    isRemoteDescriptionSet = true;
  }
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

export const toggleMic = async ({ sender, receiver }) => {
  const audioTracks = localStream.getAudioTracks();

  if (audioTracks.length > 0) {
    const audioTrack = audioTracks[0];
    audioTrack.stop();
    localStream.removeTrack(audioTrack);

    const senderToRemove = peerConnection
      .getSenders()
      .find((s) => s.track === audioTrack);
    if (senderToRemove) {
      peerConnection.removeTrack(senderToRemove);
    }

    await peerNegotiation(sender, receiver);

    return;
  }

  try {
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const newAudioTrack = newStream.getAudioTracks()[0];

    localStream.addTrack(newAudioTrack);

    peerConnection.addTrack(newAudioTrack, localStream);

    await peerNegotiation(sender, receiver);
  } catch (err) {
    console.error("Error turning on camera:", err);
  }
};

export const toggleCamera = async ({ sender, receiver }) => {
  const videoTracks = localStream.getVideoTracks();

  if (videoTracks.length > 0) {
    const videoTrack = videoTracks[0];
    videoTrack.stop();

    const senderToRemove = peerConnection
      .getSenders()
      .find((s) => s.track === videoTrack);
    if (senderToRemove) {
      peerConnection.removeTrack(senderToRemove);
    }

    localStream.removeTrack(videoTrack);

    // Set a timeout to allow browser to release the camera hardware
    setTimeout(async () => {
      await peerNegotiation(sender, receiver);
    }, 200); // 200ms delay before renegotiation

    console.log("Camera turned off");
    return;
  }

  try {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const newVideoTrack = newStream.getVideoTracks()[0];

    localStream.addTrack(newVideoTrack);
    peerConnection.addTrack(newVideoTrack, localStream);

    await peerNegotiation(sender, receiver);

    console.log("Camera turned on");
  } catch (err) {
    console.error("Error turning on camera:", err);
  }
};

export const getNewOffer = async (sender, receiver, newOffer) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(newOffer)
  );
  const newAnswer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(newAnswer);
  globalRemote.current.srcObject = remoteStream;

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
    socket.emit("endCall", callee);
  }
};
