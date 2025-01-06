import { Socket } from "socket.io-client";
import { SocketUser } from "../types";

interface iSocketStore {
  socket: Socket | null;
  onlineUsers: SocketUser[] | null;
}
