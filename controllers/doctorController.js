import { StatusCodes } from "http-status-codes";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import { jwt } from "jsonwebtoken";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor availability updated successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update doctor availability",
      error: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor list retrieved successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve doctor list",
      error: error.message,
    });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET_KEY);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Doctor logged in successfully",
        data: token,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to login doctor",
      error: error.message,
    });
  }
};

export { changeAvailability, doctorList, loginDoctor };
