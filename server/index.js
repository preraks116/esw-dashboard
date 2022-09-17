// setting up a websocket using socket.io
const express = require('express');
const app = express();

const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app);
server.maxConnections = 1000;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// var connectionsLimit = 2;

io.on('connect', (socket) => {
    console.log(`a user connected ${socket.id} ${io.engine.clientsCount}`);
});

server.listen (3001, () => {
    console.log("listening on port 3001");
});