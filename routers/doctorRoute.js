import express from "express";
import {
  appointmentCancel,
  appointmentComplete,
  doctorAppointment,
  doctorDashboard,
  doctorList,
  doctorProfile,
  loginDoctor,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorRoute = express.Router();

doctorRoute.get("/list", doctorList);
doctorRoute.post("/login", loginDoctor);
doctorRoute.get("/appointments", authDoctor, doctorAppointment);
doctorRoute.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRoute.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRoute.get("/dashboard", authDoctor, doctorDashboard);
doctorRoute.get("/profile", authDoctor, doctorProfile);
doctorRoute.post("/update-profile", authDoctor, updateDoctorProfile);

export default doctorRoute;
