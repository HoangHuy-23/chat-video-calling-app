import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  createFriendRequest,
  getFriendRequests,
  rejectFriendRequest,
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFriendRequests);

router.post("/", protectRoute, createFriendRequest);
router.post("/accept", protectRoute, acceptFriendRequest);
router.post("/reject", protectRoute, rejectFriendRequest);
router.post("/cancel", protectRoute, cancelFriendRequest);

export default router;
