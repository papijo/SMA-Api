const app = require("./app"); // the actual Express application
const http = require("http");
const config = require("./utils/config");
const server = http.createServer(app);
const { Server } = require("socket.io");
//Server to Socket Connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Socket Code
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("A user connected");

  //take userId and SocketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log(" A user Disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(config.PORT, () => {
  console.log(`Backend Server running on port ${config.PORT}`);
});
