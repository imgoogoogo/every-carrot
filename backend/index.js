
require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();

    app.listen(port, () => {
      console.log(`server is listening at localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:", error.message);
    process.exit(1);
  }
};

startServer();
