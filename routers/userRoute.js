import express from "express";
import {
  bookAppointment,
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/get-profile", authUser, getProfile);
userRoute.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRoute.post("/book-appointment", authUser, bookAppointment);

export default userRoute;
