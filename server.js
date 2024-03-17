//backend code 

import express from "express";
const app = express();
import path from "path";
import { createServer } from "http"; //creating express server 
import { Server } from "socket.io";  //creating socket server 
import { v4 } from "uuid"; //for generating a random room number

const PORT = 3000 || process.env.PORT;

const server = createServer(app); //creating express server 
const io = new Server(server, { //creating socket server 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("view engine", "ejs"); //setting the views 
app.use(express.static(path.join(path.resolve(), "public"))); //setting the public path 

app.get("/", (req, res) => {
  res.redirect(`/${v4()}`);
});

app.get("/:room", (req, res) => {
    //rendering room.ejs 
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });
});
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
