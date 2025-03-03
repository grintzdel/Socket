import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

const server = http.createServer(app);

const io = new socketIo.Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});


app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Socket' });
});

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté', socket.id);

  socket.on('send_message', (data) => {
    console.log('Message reçu:', data);
    io.emit('new_message', data); 
  });


  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté', socket.id);
  });
});


server.listen(3001, () => {
  console.log('Serveur démarré sur http://localhost:3001');
});
