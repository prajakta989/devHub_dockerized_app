const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/Chat");
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const getRoomId = (id, UserId) => {
    return crypto
      .createHash("sha256")
      .update([id, UserId].sort().join("_"))
      .digest("hex");
  };
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ name, id, UserId }) => {
      const roomId = getRoomId(id, UserId);
      console.log(`${name} joined the room: ${roomId}`);
      socket.join(roomId);
    }),
      socket.on("sendMessage", async ({ name, id, UserId, text }) => {
        try {
          const roomId = getRoomId(id, UserId);
          console.log(name + ":" + text);
          let chat = await Chat.findOne({
            participants: { $all: [id, UserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [id, UserId],
              messages: [],
            });
          }

          chat.messages.push({
            sender: id,
            text: text,
          });

          await chat.save();
          io.to(roomId).emit("receivedMessage", { name, text });
        } catch (err) {
          console.log(err);
        }
      }),
      socket.on("diconnect", () => {});
  });
};

module.exports = initializeSocket;
