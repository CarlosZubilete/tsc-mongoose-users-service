import mongoose from "mongoose";
import dotenv from "dotenv";
import { MONGO_URI } from "./env";

dotenv.config();

export default (async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB: >> ", error);
    process.exit(1);
  }
})();