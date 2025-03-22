import express from "express";
import cors from "cors";
import "dotenv/config";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";

// app config
const app = express();
dotenv.config();
const port = process.env.PORT || 8001;
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// Api End Points

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
