import { io } from "socket.io-client";

const socket = io("https://echo-backend-4am1.onrender.com", {
  transports: ["websocket", "polling"],
});

export default socket;
