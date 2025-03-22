import mongoose from "mongoose";
const connectDB = async () => {
  try {
    // MongoDB URL (local or cloud)
    const conn = await mongoose.connect(
      `mongodb+srv://vinaykushwah:vinaykushwah@cluster0.as4ps.mongodb.net/prescripto`
    );
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export default connectDB;
