const express = require("express");
const data = require("./data/data");
const cors = require("cors");
const dotenv = require("dotenv");
const socket = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errotHandlers");

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Server is running....")
})

app.get("/api/chats", (req, res) => {
    res.send(data)
})

app.get("/chat/:id", (req,res) => {
    console.log(req.params.id);
    const id = req.params.id;

    const findChat = data.filter((msg) => msg._id === id);

    res.send(findChat);
})

const server = app.listen(port, () => {
    console.log(`server running on port ${port}`);
    console.log(`Open: http://localhost:${port}`)
})

const io = socket(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined Room: "+room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach((user) => {
            if(user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        }); 
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
});