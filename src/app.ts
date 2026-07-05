import app from "sources/server";
import dotenv from "dotenv";
import "@config/connection"; // Initialize MongoDB connection

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});