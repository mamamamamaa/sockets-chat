const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const { findMessage, createMessage } = require("./services/message");
const { HOST, PORT } = process.env;

global.onlineUsers = new Map();

app.use(cors());
app.get(
  "/",
  express.static(path.join(__dirname, "./frontend/build/index.html"))
);

mongoose.set("strictQuery", true);
mongoose.connect(HOST, () => console.log("BD is connect!!!"));

const http = require("http").Server(app);

const socket = require("socket.io")(http, {
  cors: { origin: "https://socket-chat-front.onrender.com" },
});

socket.on("connection", async (client) => {
  const messages = await findMessage();
  client.emit("change online", onlineUsers.size);
  client.emit("fetch messages", messages);

  client.on("add user", (user) => {
    onlineUsers.set(client.id, user.id);
    client.broadcast.emit("change online", onlineUsers.size);
    client.emit("change online", onlineUsers.size);
  });

  client.on("new message", async (message) => {
    const res = await createMessage(message);

    client.broadcast.emit("add message", res);
  });

  client.on("disconnect", () => {
    console.log(client.id);
    onlineUsers.delete(client.id);
    client.broadcast.emit("change online", onlineUsers.size);
  });
});

http.listen(PORT, () => console.log("Server is running"));
