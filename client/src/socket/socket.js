import { io } from "socket.io-client";

const socket = io("https://the-dino-king.onrender.com");

export default socket;