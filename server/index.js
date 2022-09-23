// setting up a websocket using socket.io
const express = require('express');
const app = express();
const axios = require('axios');
const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app);
server.maxConnections = 2;
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// var connectionsLimit = 2;

const writeAPIkey = "NGYL81G5BC8U6Z4F";

io.on('connect', (socket) => {
    console.log(`a user connected ${socket.id} ${io.engine.clientsCount}`);

    socket.on('dutyCycle', (data) => {
        console.log(data);
        axios.post('https://api.thingspeak.com/update.json', {
            "api_key": writeAPIkey,
            "field1": data
        })
    });
});

server.listen (3001, () => {
    console.log("listening on port 3001");
});