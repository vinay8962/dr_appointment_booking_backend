import { StatusCodes } from "http-status-codes";
import doctorModel from "../models/doctorModel.js";

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

export { changeAvailability };
