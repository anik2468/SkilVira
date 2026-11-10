import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const { default: app } = await import("./app.js");
    const { default: connectDB } = await import("./config/db.js");

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Skilvira server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
