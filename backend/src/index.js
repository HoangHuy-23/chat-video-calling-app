import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import CookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import contactRoutes from "./routes/contact.route.js";
import friendRequestRoutes from "./routes/friendRequest.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(CookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/friend-request", friendRequestRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
