require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // No trailing slash!
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);



if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      console.log("database connection successfully established...");

      server.listen(3000, "0.0.0.0", () => {
        console.log("Server is running on port 3000");
      });
    })
    .catch((err) => {
      console.log("database connection disrupted", err);
    });
}

module.exports = app;
