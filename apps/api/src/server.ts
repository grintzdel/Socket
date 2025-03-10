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

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Socket API' });
});

io.on('connection', (socket) => {
  socketHandlers(io, socket);
});

server.listen(3001, () => {
  console.log('🚀 Server running at http://localhost:3001');
});
