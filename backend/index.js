require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const initSocket = require("./config/socket");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/chats", require("./routes/chat"));
app.use("/api/products", require("./routes/products"));
app.use("/api/users", require("./routes/users"));

app.get("/", (_req, res) => {
  res.json({ success: true });
});

initSocket(server);

server.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
