import express from "express";
import protectRoute from "./protectRoute.js";
import { getUsersForSidebar,setUserStatus } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.post("/:userId/status", setUserStatus);

export default router;
