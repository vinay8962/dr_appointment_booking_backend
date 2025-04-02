import express from "express";
import cors from "cors";
import "dotenv/config";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routers/adminRoute.js";
import doctorRoute from "./routers/doctorRoute.js";
import userRoute from "./routers/userRoute.js";

// app config
const app = express();
dotenv.config();
const port = process.env.PORT || 8001;
connectDB();
connectCloudinary();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api End Points
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRoute);
app.use("/api/user", userRoute);

// default route
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
