import { StatusCodes } from "http-status-codes";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

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
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET_KEY);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Doctor logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to login doctor",
      error: error.message,
    });
  }
};

const doctorAppointment = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to login doctor",
      error: error.message,
    });
  }
};

const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Appointment Completed",
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Mark Failed",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to login doctor",
      error: error.message,
    });
  }
};
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Appointment Cancelled",
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Cancellation Failed",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to login doctor",
      error: error.message,
    });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  doctorAppointment,
  appointmentComplete,
  appointmentCancel,
};
