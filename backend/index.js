require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const initSocket = require("./config/socket");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (_req, res) => {
  res.json({ success: true });
});

initSocket(server);

server.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
