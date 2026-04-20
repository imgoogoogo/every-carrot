const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(
  cors({
    origin : process.env.CLIENT_URL,
    credentials : true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success : true });
});

app.use("/api/users", require("./routes/users"));

module.exports = app;
