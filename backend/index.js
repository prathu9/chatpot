const express = require("express");
const data = require("./data/data");
const cors = require("cors");
const dotenv = require("dotenv");
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

app.listen(port, () => {
    console.log(`server running on port ${port}`);
    console.log(`Open: http://localhost:${port}`)
})