import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { renameSync, unlinkSync } from "fs";

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password is required" });
    } else {
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        const newUser = await User.create({ email, password });
        const _id = newUser._id;
        const token = jwt.sign({ _id }, process.env.JWT_KEY, {
          expiresIn: "15d",
        });
        return res
          .cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None",
          })
          .status(201)
          .json({
            _id: newUser._id,
            email: newUser.email,
            profileSetup: newUser.profileSetup,
          });
      }
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password is required" });
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      } else {
        const isPasswordCorrect = await bcryptjs.compare(
          password,
          user.password
        );
        if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Incorrect Password" });
        } else {
          const _id = user._id;
          const token = jwt.sign({ _id }, process.env.JWT_KEY, {
            expiresIn: "15d",
          });
          return res
            .cookie("jwt", token, {
              maxAge: 15 * 24 * 60 * 60 * 1000,
              secure: true,
              sameSite: "None",
            })
            .status(200)
            .json({
              _id: user._id,
              email: user.email,
              profileSetup: user.profileSetup,
              firstName: user.firstName,
              lastName: user.lastName,
              image: user.image,
              color: user.color,
            });
        }
      }
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userinfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req._id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json({
        _id: userData._id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      });
    }
  } catch (error) {
    console.log("Error in userinfo controller: ", error.message);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, color } = req.body;
    const _id = req._id;
    if (!firstName || !lastName || (!color && color != 0)) {
      return res.status(400).json({ error: "Incomplete details" });
    } else {
      const userData = await User.findByIdAndUpdate(
        _id,
        {
          firstName,
          lastName,
          color,
          profileSetup: true,
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        _id: userData._id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      });
    }
  } catch (error) {
    console.log("Error in updateProfile controller: ", error.message);
  }
};

export const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    } else {
      const date = Date.now();
      let fileName = "uploads/profiles/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const updatedUser = await User.findByIdAndUpdate(
        req._id,
        { image: fileName },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ image: updatedUser.image });
    }
  } catch (error) {
    console.log("Error in updateProfileImage controller: ", error.message);
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const userId = req._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile image removed successfully" });
  } catch (error) {
    console.log("Error in removeProfileImage controller: ", error.message);
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" })
      .status(200)
      .json({ Message: "Logged Out successfully" });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
  }
};
