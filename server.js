require("dotenv").config();
const { log } = require("console");
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
    const userId = socket.handshake.query.userId;
    console.log(userId);


    //emit sendMessage
    socket.on("send-message",(event) => {
        console.log(`user ${userId} sending ${event.to} is message ${event.message}`);
    })

    // disconnect
    socket.on("disconnect",(event) => {
        console.log(`user ${userId} disconnected`);
    })

})

// server listening on port
server.listen(port,() =>{console.log(`succesfully connected in ${port}`)});