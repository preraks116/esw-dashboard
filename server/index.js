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
    // if (io.engine.clientsCount > connectionsLimit) {
    //     socket.emit('err', { message: 'reach the limit of connections' })
    //     socket.disconnect()
    //     console.log('Disconnected...')
    //     return
    //   }
    // else{
    //     socket.emit('success', { message: 'connected' })
    // }
});

server.listen (3001, () => {
    console.log("listening on port 3001");
});