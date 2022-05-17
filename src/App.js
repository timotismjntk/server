const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)
const socketio = require("socket.io");
const { ExpressPeerServer } = require("peer");
const io = socketio(server).sockets;

const customGenerationFunction = () =>
  (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
  generateClientId: customGenerationFunction,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

app.get('/', async (req, res) => {
  try {
    res.send({
      success: true,
      message: 'Backend is running',
    })
  } catch (e) {
    res.send({
      success: false,
      message: 'Error',
    })
  }
})

app.get("/:room", (req, res) => {
  res.send({
    success: true,
    roomId: req.params.room,
  });
});

io.on('connection', (socket) => {
  console.log('User connected to server')
  socket.on("join-room", ({roomID, userId}) => {
    console.log(roomID, userId);
    socket.join(roomID);
    socket.to(roomID).emit('user-connected', userId);
    // socket.to(roomId).emit("user-connected", userId);
  });
  socket.on("message", ({userId, chat}) => {
    console.log(userId, chat);
  });
});


server.listen(8080, () => {
  console.log('listening on port ' + 8080)
})