import { Router } from "express";
import {
  login,
  signup,
  userinfo,
  updateProfile,
  updateProfileImage,
  removeProfileImage,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const authRoute = Router();
const upload = multer({ dest: "uploads/profiles/" });

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.get("/userinfo", verifyToken, userinfo);
authRoute.post("/updateprofile", verifyToken, updateProfile);
authRoute.post(
  "/updateprofileimage",
  verifyToken,
  upload.single("profile-image"),
  updateProfileImage
);
authRoute.delete("/removeprofileimage", verifyToken, removeProfileImage);
authRoute.post("/logout", logout);

export default authRoute;
