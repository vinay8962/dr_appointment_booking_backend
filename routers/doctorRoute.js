import express from "express";
import { doctorList, loginDoctor } from "../controllers/doctorController.js";

const doctorRoute = express.Router();

doctorRoute.get("/list", doctorList);
doctorRoute.post("/login", loginDoctor);

export default doctorRoute;
