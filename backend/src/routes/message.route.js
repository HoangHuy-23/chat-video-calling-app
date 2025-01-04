import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteMessage,
  emoteMessage,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);

router.get("/:conversationId", protectRoute, getMessages);

router.delete("/:messageId", protectRoute, deleteMessage);

router.post("/emotions", protectRoute, emoteMessage);

export default router;
