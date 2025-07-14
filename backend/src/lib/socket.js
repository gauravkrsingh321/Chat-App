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


//Final Composition
//app → for all REST API routes, middleware, etc.
//server → wraps app, runs the HTTP server, and hosts Socket.IO.
//io → listens for WebSocket events.


//Listens for connections and disconnections
io.on("connection", (socket)=> {  //this socket is the user that has just connected
  console.log("A user connected", socket.id);

  socket.on("manual-disconnect", (userId) => {
    console.log(`User ${userId} manually disconnected (logout). Socket ID: ${socket.id}`);
    // Optional: update user's online status in DB
  });

  socket.on("disconnect", ()=> {
    console.log("A user disconnected",socket.id)
  })
})


export {io, app, server};