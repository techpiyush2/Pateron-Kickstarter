import express from "express";
import {
  changePassword,
  deleteMyProfile,
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
  chooseRole,
  getAllUsers,
  updateProfilePicture,
} from "../controllers/userController.js";
import {profileUpload} from "../middleware/multer.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

export const userRoutes = express.Router();

// To register a new user
userRoutes.route("/register").post(register);

// Login
userRoutes.route("/login").post(login);

// logout
userRoutes.route("/logout").post(logout);

// Get my profile
userRoutes.route("/getProfile").post(verifyToken, getMyProfile);

// Delete my profile
userRoutes.route("/deleteProfile").post(verifyToken, deleteMyProfile);

// ChangePassword
userRoutes.route("/changePassword").post(verifyToken, changePassword);

// UpdateProfile
userRoutes.route("/updateProfile").post(verifyToken, updateProfile);

// UpdateProfilePicture
userRoutes
  .route("/updateProfilePicture")
  .post(verifyToken, profileUpload, updateProfilePicture);

// ForgetPassword
userRoutes.route("/forgetPassword").post(forgetPassword);

// ResetPassword
userRoutes.route("/resetpassword/").post(resetPassword);

//chooseRole
userRoutes.route("/chooseRole").post(chooseRole);

// Admin Routes
userRoutes.route("/admin/users").get(verifyToken, getAllUsers);
