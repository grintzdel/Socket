import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css'; // Importation du fichier CSS

interface Message {
  message: string;
}

const SocketClient: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketConnection = io('http://localhost:3001');
    setSocket(socketConnection);

    socketConnection.on('connection_success', (data) => {
      console.log('Connecté au serveur:', data);
    });

    socketConnection.on('new_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (socket && newMessage.trim() !== '') {
      socket.emit('send_message', { message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Client Socket.io</h2>

      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez un message"
        />
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>

      <div>
        <h3>Messages</h3>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocketClient;
