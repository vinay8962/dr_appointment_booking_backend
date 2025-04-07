import express from "express";
import {
  addDoctor,
  adminDashboardData,
  allDoctors,
  appointmentAdmin,
  appointmentCancel,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middleware/multer.js ";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/all-appointments", authAdmin, appointmentAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard-data", authAdmin, adminDashboardData); // Assuming you want to use the same endpoint for dashboard data
export default adminRouter;
