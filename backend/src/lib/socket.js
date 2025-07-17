import {Server} from "socket.io";
import http from "http"
import express from "express"

//Code below sets up a basic Socket.IO server on top of an Express.js HTTP server.
//Socket.IO works at the HTTP level and WebSocket level. It needs access to the raw HTTP server to upgrade HTTP connections to WebSocket connections.

//Sets up Express and HTTP servers
const app =express();
const server = http.createServer(app);  //This wraps the app inside a Node.js HTTP server. Purpose: Allows you to handle low-level HTTP stuff and attach things like WebSockets (Socket.IO)

//Creates a Socket.IO server instance
const io = new Server(server, {
  cors:{
    origin:["http://localhost:5173"]  //Enables CORS for frontend 
  }
}) 

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//Used to store online users //Stores a mapping: userId → socket.id
const userSocketMap = {}  

//Listens for connections and disconnections
io.on("connection", (socket)=> {  //this socket is the user that has just connected
  // When a client connects, we grab their userId from query params.
  // Save it in userSocketMap. Store it on socket.userId for later access (like on disconnect).Notify all clients about the current list of online users.

  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  
  // ✅ Fix: guard against missing or invalid userId
  if (!userId || userId === 'undefined' || userId === 'null') {
    console.warn("Invalid userId in socket connection:", userId);
    socket.disconnect(); // optional: reject the connection
    return;
  }
  userSocketMap[userId] = socket.id;
  socket.userId = userId;

  //io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))


  //Handles manual logout (e.g., when user clicks "Log out").
  //Cleans up their socket entry and notifies others.You want to cleanly remove users from online list when they intentionally log out (not just close tab).
  socket.on("manual-disconnect", (userId) => {
    console.log(`User ${userId} manually disconnected`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.disconnect();
  });


  //Triggered when user closes tab, refreshes, loses connection.
  //Removes user from userSocketMap.
  //Broadcasts updated list to all users.Real-time presence detection i.e if a user leaves the page or goes offline, remove them from the online user list.
  socket.on("disconnect", ()=> {
    console.log("A user disconnected",socket.id)
      if(socket.userId) {
      delete userSocketMap[socket.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  })
})


export {io, app, server};

//Final Composition
//app → for all REST API routes, middleware, etc.
//server → wraps app, runs the HTTP server, and hosts Socket.IO.
//io → listens for WebSocket events.