import { Server, Socket } from 'socket.io';

const connectedUsers: Map<string, string> = new Map();

export const socketHandlers = (io: Server, socket: Socket): void => {
  console.log(`User connected: ${socket.id}`);

  // verification pseudo
  socket.on('check_pseudo', (pseudo: string) => {
    if (pseudo.length < 4) {
      socket.emit('pseudo_status', { status: 'too_short', message: 'Pseudo must be at least 4 characters long.' });
    } else if ([...connectedUsers.values()].includes(pseudo)) {
      socket.emit('pseudo_status', { status: 'taken', message: 'This pseudo is already taken.' });
    } else {
      connectedUsers.set(socket.id, pseudo);
      socket.emit('pseudo_status', { status: 'available', message: 'Pseudo accepted!' });

      io.emit('user_list', Array.from(connectedUsers.values()));
    }
  });

  // envoie de message
  socket.on('send_message', (data: { pseudo: string; message: string }) => {
    console.log("Message reçu du client :", data);
    io.emit('new_message', data);
  });


  // deconnexion
  socket.on('logout', () => {
    const pseudo = connectedUsers.get(socket.id);
    if (pseudo) {
      connectedUsers.delete(socket.id);
      io.emit('system_message', `${pseudo} left the chat`);
      io.emit('user_list', Array.from(connectedUsers.values()));
    }
  });


};
