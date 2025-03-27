import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import authRoute from "./routes/authRoute.js";
import contactRoute from "./routes/contactRoute.js";
import setupSocket from "./socket.js";
import messageRoute from "./routes/messageRoute.js";
import channelRoute from "./routes/channelRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/messages", messageRoute);
app.use("/api/channel", channelRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});

setupSocket(server);
