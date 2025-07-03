import { io } from "socket.io-client";

const socket = io("https://api.echo.linkpc.net", {
  transports: ["websocket", "polling"],
});

export default socket;
