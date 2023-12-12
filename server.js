require("dotenv").config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

// variables
const port = process.env.Port || 3000;

// Socket Io
io.on("connection", socket => {
    const socketId = socket.id
})

// server listening on port
server.listen(port,() =>{console.log(`succesfully connected in ${port}`)});