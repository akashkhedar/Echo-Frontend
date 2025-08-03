import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Make sure you correct the typo: "locahost" → "localhost"
    : "https://api.echo.linkpc.net";

const userId = (state) => state.user.userId;

const socket = io(URL, {
  query: { userId },
  transports: ["websocket", "polling"],
});

export default socket;
