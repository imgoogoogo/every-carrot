require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
