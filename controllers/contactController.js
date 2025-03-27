import mongoose from "mongoose";
import User from "../model/userModel.js";
import Message from "../model/messageModel.js";

export const searchContact = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).json({ error: "searchTerm is required" });
    }
    const sanitizeSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizeSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req._id } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log("Error in searchContact controller: ", error.message);
  }
};

export const getContactForDMList = async (req, res, next) => {
  try {
    let { _id } = req;
    _id = new mongoose.Types.ObjectId(_id);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: _id }, { recipient: _id }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", _id] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log("Error in searchContact controller: ", error.message);
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await User.find(
      { _id: { $ne: req._id } },
      { password: 0 }
    );

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log("Error in searchContact controller: ", error.message);
  }
};
