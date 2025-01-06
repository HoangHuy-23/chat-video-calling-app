import { Server } from "socket.io";
import http from "http";
import express from "express";
import Conversation from "../models/conversation.model.js";

const port = process.env.PORT || 5001;
const host = process.env.HOST || "localhost";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export function getReceiverSocket(userId) {
  return userSocket[userId];
}

let userSocket = [];

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id);
  // join application
  socket.on("join", (user) => {
    user &&
      !userSocket.some((user) => user.userId === user._id) &&
      userSocket.push({ userId: user._id, socketId: socket.id });
    console.log(userSocket);
    io.emit("getOnlineUsers", userSocket);
  });
  // disconnect
  socket.on("disconnect", () => {
    userSocket = userSocket.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", userSocket);
    console.log("user disconnected: ", userSocket);
  });

  // send message
  socket.on("sendMessage", async ({ senderId, conversationId, message }) => {
    const response = await Conversation.findById(conversationId);
    if (!response) {
      return;
    }
    const receiverIds = response.members
      .filter((member) => member._id.toString() !== senderId.toString())
      .map((member) => member._id.toString());

    console.log("receiverIds", receiverIds);

    receiverIds.forEach((receiverId) => {
      const recipient = userSocket.find(
        (user) => user.userId.toString() === receiverId
      );
      console.log("recipient", recipient);

      if (recipient) {
        io.to(recipient.socketId).emit("getMessage", message);
      }
    });
  });

  // notification
  socket.on(
    "sendNotification",
    async ({ conversationId, lastMessage, updatedAt }) => {
      const response = await Conversation.findById(conversationId);
      if (!response) {
        return;
      }
      const receiverIds = response.members;

      console.log("receiverIds", receiverIds);

      receiverIds.forEach((receiverId) => {
        const recipient = userSocket.find(
          (user) => user.userId.toString() === receiverId.toString()
        );
        console.log("recipient", recipient);

        if (recipient) {
          io.to(recipient.socketId).emit("getNotification", {
            conversationId,
            lastMessage,
            updatedAt,
          });
        }
      });
    }
  );
});

server
  .once("error", (err) => {
    console.log("error", err);
  })
  .listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

export { io, server, app };
