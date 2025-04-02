import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields (name, email, and password) are required.",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        "An error occurred while registering the user. Please try again.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while logging in. Please try again.",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Fetch user data
    const userData = await userModel.findById(userId).select("-password");

    // Check if user exists
    if (!userData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User profile retrieved successfully.",
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while retrieving user data.",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          "Missing required fields: userId, name, phone, dob, or gender.",
      });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      //  upload image to cloudinary

      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating the profile.",
      error: error.message,
    });
  }
};

export { registerUser, loginUser, getProfile, updateProfile };
