require("dotenv").config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
const bodyParser = require('body-parser');
const {MongoClient} = require("mongodb");

// variables
const port = process.env.Port || 3000;
const users = [];

//  Middlewares
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

// Events
const receivedMessageEvent = process.env.receivedMessageEvent;

// Socket Io
io.on("connection", socket => {
    const socketId = socket.id
    const userId = socket.handshake.query.userId;
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
app.post("/api/register",(req,res) => {
  const fullName = req.body.fullName
  const userName = req.body.userName
  const password = req.body.password

  if(fullName === undefined || userName === undefined || password === undefined){
    res.status(400).json({
        "message": "please enter all required fields",
    })

    // connect to database
    MongoClient.connect(process.env.DataBaseUrl,(err,db) => {
      if(err) console.log(err);
      // database object
      const dbo = db.db(process.env.DataBaseName)
      // user object
      const newUser = {
        fullName: fullName,
        userName: userName,
        password: password
      }
      // create collection
      dbo.collection(process.env.UsereCollection).insertOne(newUser,(err,result) => {
        if(err) console.log(err);
        res.json(
          {
            "message" : "registered successfully",
            "data" : result
          }
        )
        db.close();
      })
    })

  }
})

// server listening on port
server.listen(port,() =>{console.log(`succesfully connected in ${port}`)});