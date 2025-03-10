import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { socketHandlers } from './socketHandlers';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

let connectedUsers: string[] = [];

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Socket API' });
});

io.on('connection', (socket) => {
  socket.on('user:join', (data) => {
    const { username } = data;
    
    if (username && !connectedUsers.includes(username)) {
      connectedUsers.push(username);
      io.emit('connected_users', connectedUsers);
    }
  });

  socketHandlers(io, socket);

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(user => user !== socket.id);
    io.emit('connected_users', connectedUsers);
  });

  io.emit('connected_users', connectedUsers);
});

server.listen(3001, () => {
  console.log('🚀 Server running at http://localhost:3001');
});
