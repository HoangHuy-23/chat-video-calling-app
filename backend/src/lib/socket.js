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
    if (user) {
      const existingUserIndex = userSocket.findIndex(
        (u) => u.userId === user._id
      );

      if (existingUserIndex !== -1) {
        // Cập nhật socketId nếu người dùng đã tồn tại
        userSocket[existingUserIndex].socketId = socket.id;
      } else {
        // Thêm người dùng mới nếu chưa tồn tại
        userSocket.push({ userId: user._id, socketId: socket.id });
      }
      console.log("userSocket", userSocket);
      io.emit("getOnlineUsers", userSocket);
    }
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

  // friend request
  socket.on("sendFriendRequest", (data) => {
    const recipient = userSocket.find(
      (user) => user.userId.toString() === data.receiverId.toString()
    );
    console.log("recipient", recipient);

    if (recipient) {
      io.to(recipient.socketId).emit("getFriendRequest", data);
    }
  });

  // new group
  socket.on("newGroup", (data) => {
    data.members.forEach((member) => {
      const recipient = userSocket.find(
        (user) => user.userId.toString() === member._id.toString()
      );
      console.log("recipient", recipient);

      if (recipient) {
        io.to(recipient.socketId).emit("getNewGroup", data);
      }
    });
  });
  // call user
  socket.on("call", async (participants) => {
    console.log("call", participants);
    if (participants.receiver.socketId) {
      io.to(participants.receiver.socketId).emit("incomingCall", participants);
    }
  });

  // signal to user
  socket.on("webrtcSignal", async (data) => {
    if (data.isCaller) {
      if (data.ongoingCall.participants.receiver.socketId) {
        io.to(data.ongoingCall.participants.receiver.socketId).emit(
          "webrtcSignal",
          data
        );
      }
    } else {
      if (data.ongoingCall.participants.caller.socketId) {
        io.to(data.ongoingCall.participants.caller.socketId).emit(
          "webrtcSignal",
          data
        );
      }
    }
  });

  // hang up call
  socket.on("hangup", async (data) => {
    let socketIdToEmit;
    if (data.ongoingCall.participants.caller.userId === data.userHangupId) {
      socketIdToEmit = data.ongoingCall.participants.receiver.socketId;
    } else {
      socketIdToEmit = data.ongoingCall.participants.caller.socketId;
    }
    if (socketIdToEmit) {
      io.to(socketIdToEmit).emit("hangup");
    }
  });
});

server
  .once("error", (err) => {
    console.log("error", err);
  })
  .listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

export { io, server, app };
