import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {getChannelMessages, 
  createChannel,
  getUserChannels,
} from "../controllers/channelController.js";

const channelRoute = Router();

channelRoute.post("/createchannel", verifyToken, createChannel);
channelRoute.get("/getuserchannels", verifyToken, getUserChannels);
channelRoute.get(
  "/getchannelmessages/:channelId",
  verifyToken,
  getChannelMessages
);

export default channelRoute;
