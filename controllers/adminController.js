import { StatusCodes } from "http-status-codes";
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

// API for adding doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      experience,
      degree,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !degree ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "All fields are required" });
    }
    const parsedAddress =
      typeof address === "string" ? JSON.parse(address) : address;

    // Validate address format
    if (!parsedAddress.line1 || !parsedAddress.line2) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid address format" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please enter valid email" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Please enter a strong password" });
    }

    // hashing doctor password

    const salt = await bcrypt.genSalt(0);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      experience,
      degree,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);

    await newDoctor.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Doctor added successfully",
      data: newDoctor,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

//API For admin login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email: email, password: password },
        process.env.JWT_SECRET_KEY
      );
      res.status(StatusCodes.OK).json({
        success: true,
        message: "Admin logged in successfully",
        token: token,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctors retrieved successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve doctors",
      error: error.message,
    });
  }
};

const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

export { addDoctor, loginAdmin, allDoctors, appointmentAdmin };
