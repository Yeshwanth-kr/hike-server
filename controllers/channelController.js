import User from "../model/userModel.js";
import Channel from "../model/channelModel.js";
import mongoose from "mongoose";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req._id;
    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).json({ error: "Admin User not found" });
    } else {
      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
        return res
          .status(400)
          .json({ error: "Some members are not valid users" });
      } else {
        const newChannel = new Channel({
          name,
          members,
          admin: userId,
        });
        await newChannel.save();
        return res.status(201).json({ channel: newChannel });
      }
    }
  } catch (error) {
    console.log("Error in createChannel controller: ", error.message);
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req._id);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ channels });
  } catch (error) {
    console.log("Error in getUserChannels controller: ", error.message);
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getUserChannels controller: ", error.message);
  }
};
