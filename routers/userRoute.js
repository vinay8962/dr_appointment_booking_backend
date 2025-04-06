import express from "express";
import {
  bookAppointment,
  cancelAppointment,
  getProfile,
  listAppointment,
  loginUser,
  paymentRazorpay,
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
userRoute.get("/list-appointment", authUser, listAppointment);
userRoute.post("/cancel-appointment", authUser, cancelAppointment);
userRoute.post("/payment-razorpay", authUser, paymentRazorpay);

export default userRoute;
