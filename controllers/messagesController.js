import Message from "../model/messageModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req._id;
    const user2 = req.body;
    if (!user1 || !user2) {
      return res.status(400).json({ error: "Both user IDs are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({ fileURL: fileName });
  } catch (error) {
    console.log("Error in uploadFile controller: ", error.message);
  }
};

