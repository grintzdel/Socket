import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

interface Message {
  pseudo: string;
  message: string;
}

const SocketClient: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [pseudo, setPseudo] = useState<string>('');
  const [pseudoError, setPseudoError] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPseudoSet, setIsPseudoSet] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const socketConnection = io('http://localhost:3001');
    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connexion réussie avec le serveur !');
    });

    socketConnection.on('new_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketConnection.on('system_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, { pseudo: 'Système', message }]);
    });

    socketConnection.on('user_list', (userList: string[]) => {
      setUsers(userList);
    });


    socketConnection.on('pseudo_status', (status: { status: string, message: string }) => {
      if (status.status === 'available') {
        setIsPseudoSet(true);
        setPseudoError('');
        console.log('Pseudo accepté!');
      } else {
        setPseudoError(status.message);
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (socket && newMessage.trim() !== '' && pseudo.trim() !== '') {
      console.log("Envoi du message : ", newMessage, "Pseudo : ", pseudo);
      socket.emit('send_message', { pseudo, message: newMessage });
      setNewMessage('');
    } else {
      console.log("Erreur: Le message ou le pseudo est invalide.");
    }
  };


  const handleSetPseudo = () => {
    if (pseudo.trim().length < 4) {
      setPseudoError('Le pseudo doit contenir au moins 4 caractères.');
      return;
    }

    if (socket) {
      socket.emit('check_pseudo', pseudo);
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.emit('logout');
      setIsPseudoSet(false);
      setPseudo('');
      setMessages([]);
    }
  };

  return (
    <div>
      <h2>Client Socket.io</h2>

      {!isPseudoSet ? (
        <div>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Choisissez un pseudo"
          />
          <button onClick={handleSetPseudo}>Valider</button>
          {pseudoError && <p style={{ color: 'red' }}>{pseudoError}</p>}
        </div>
      ) : (
        <div>
          <p>Connecté en tant que : <strong>{pseudo}</strong></p>
          <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Déconnexion</button>

          <br /><br />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez un message"
          />
          <button onClick={handleSendMessage}>Envoyer</button>
        </div>
      )}

      <h3>Utilisateurs en ligne</h3>
      <ul>{users.map((user, index) => <li key={index}>{user}</li>)}</ul>

      <h3>Messages</h3>
      <ul>{messages.map((msg, index) => <li key={index}><strong>{msg.pseudo}:</strong> {msg.message}</li>)}</ul>
    </div>
  );
};

export default SocketClient;
