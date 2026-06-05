require("dotenv").config();

const app = require("./app");
const pool = require("../config/db");

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();