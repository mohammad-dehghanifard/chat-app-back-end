require("dotenv").config();
const express = require('express');
const http = require('http');
const app = express();
const authRoute = require('./routers/auth')
const server = http.createServer(app);
const io = require("socket.io")(server);
const bodyParser = require('body-parser');
const {MongoClient} = require("mongodb");
const getToken = require("./utils/get_user_id_from_token")



// variables
const port = process.env.Port || 3000;
const users = [];

//  Middlewares
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

// Events
const receivedMessageEvent = process.env.receivedMessageEvent;

// Socket Io
io.on("connection",  async (socket) => {
    const socketId = socket.id
    // get user id from token
    const token = socket.handshake.query.token
    const checkToken = await getToken(token)
    if(checkToken == null){ socket.disconnect()}
    const userId = checkToken.data.id

    users.push({ userId: userId, socketId: socketId });

    // Send Message
    socket.on("send-message",(event) => {
     // Group Chat
     if(event.roomId != undefined ){
      io.to(`roomId${event.roomId}`).emit(receivedMessageEvent,{
        "message": event.message,
        "from": userId,
      })
     }
      //Send private messages between two users
     else{
      const filterUser = users.filter((user) => user.userId === event.to);
      const receivedSocketId = filterUser[0].socketId;
      socket.broadcast.to(receivedSocketId).emit(receivedMessageEvent,{
        "from" : userId,
        "message" : event.message
      })

     }

    })

    // user join the chat group
    socket.on(process.env.joinRoom, (event) => {
      socket.join(`roomId${event.roomId}`);
      console.log(`${userId} joined room`)
    })
    // user leave the chat group
    socket.on(process.env.leaveRoom, (event) => {
      socket.leave(`roomId${event.roomId}`);
      console.log(`${userId} leave room`)
    })


    // disconnect
    socket.on("disconnect",(event) => {
        console.log('\x1b[36m%s\x1b[0m',`user ${userId} disconnected`);
        const filterUser = users.filter((user) => user.userId === userId);    
        const user = filterUser[0];
        users.slice(user,1);
    })

})

// rest full api
app.use('/api',authRoute)

// server listening on port
server.listen(port,() =>{console.log(`succesfully connected in ${port}`)});