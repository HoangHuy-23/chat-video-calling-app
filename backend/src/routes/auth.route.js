import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

router.get("/me", protectRoute, checkAuth);

export default router;
