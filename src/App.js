const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io')(server).sockets;
const {ExpressPeerServer} = require('peer');
const {v4: uuidv4} = require('uuid');
module.exports = socketIO;

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/',
  generateClientId: uuidv4(),
});
const konsultasiRoute = require('./routes/konsultasi');
const konsultasiSocket = require('./controllers/socketKonsultasi')

app.use('/peerjs', peerServer);
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

// routes custom
app.use('/konsultasi', konsultasiRoute);

app.get('/', async (req, res) => {
  try {
    res.send({
      success: true,
      message: 'Backend is running',
    });
  } catch (e) {
    res.send({
      success: false,
      message: 'Error',
    });
  }
});

socketIO.on('connection', socket => {
  console.log('User connected to server');
  socket.on('join-room', ({roomID, userId}) => {
    socket.join(roomID);
    socket.to(roomID).emit('user-connected', userId);
  });
  socket.on('message', ({userId, chat}) => {
    console.log(userId, chat);
  });
});

server.listen(80, () => {
  console.log('listening on port ' + 80);
});
