import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createConversationAsGroup,
  createConversationAsTwo,
  getConversation,
  getConversations,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/create-group", protectRoute, createConversationAsGroup);

router.post("/create-two", protectRoute, createConversationAsTwo);

router.get("/my-conversation", protectRoute, getConversations);

router.get("/my-conversation/:conversationId", protectRoute, getConversation);

export default router;
