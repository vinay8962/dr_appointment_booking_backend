import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET_KEY);

    if (
      token_decode.email !== process.env.ADMIN_EMAIL ||
      token_decode.password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Not Authorized. Invalid token.",
      });
    }

    next();
  } catch (err) {
    res.json({ success: false, message: err });
  }
};

export default authAdmin;
