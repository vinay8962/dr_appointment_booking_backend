import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.body.userId = token_decode.id;

    next();
  } catch (err) {
    res.json({ success: false, message: err });
  }
};

export default authUser;
