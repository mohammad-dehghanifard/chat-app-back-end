require("dotenv").config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

// variables
const port = process.env.Port || 3000;
const users = [];

// Events
const receivedSingleMessageEvent = process.env.receivedSingleMessageEvent;

// Socket Io
io.on("connection", socket => {
    const socketId = socket.id
    const userId = socket.handshake.query.userId;
    users.push({ userId: userId, socketId: socketId });
    //emit sendMessage
    socket.on("send-message",(event) => {
      // ارسال پیام بین کاربران
      const filterUser = users.filter((user) => user.userId === event.to);
      const receivedSocketId = filterUser[0].socketId;
      socket.broadcast.to(receivedSocketId).emit(receivedSingleMessageEvent,{
        "on" : event.on,
        "message" : event.message
      })
    })

    // disconnect
    socket.on("disconnect",(event) => {
        console.log('\x1b[36m%s\x1b[0m',`user ${userId} disconnected`);
        const filterUser = users.filter((user) => user.userId === userId);    
        const user = filterUser[0];
        users.slice(user,1);
    })

})

// server listening on port
server.listen(port,() =>{console.log(`succesfully connected in ${port}`)});