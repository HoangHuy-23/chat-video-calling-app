import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", protectRoute, getMyContacts);

export default router;
