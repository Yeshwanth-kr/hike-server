import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getMessages, uploadFile } from "../controllers/messagesController.js";
import multer from "multer";

const messageRoute = Router();
const upload = multer({ dest: "uploads/files" });

messageRoute.post("/getMessages", verifyToken, getMessages);
messageRoute.post(
  "/uploadfile",
  verifyToken,
  upload.single("file"),
  uploadFile
);

export default messageRoute;
