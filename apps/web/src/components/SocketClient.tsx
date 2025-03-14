import React, { useEffect, useState, type ChangeEvent } from "react";
import { useChatContext } from "../hooks/useChatContext.ts";
import { useUserContext } from "../hooks/useUserContext.ts";
import { useSocket } from "../hooks/useSocket";
import {
  isConnected as checkIsConnected,
  setConnected,
} from "../utils/storage";
import { LoginForm } from "./LoginForm";
import UserTyping from "./UserTyping";

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

const SocketClient: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnectedState] = useState(() => {
    return checkIsConnected();
  });
  const { messages } = useChatContext();
  const { user } = useUserContext();
  const {
    initSocket,
    sendMessage,
    startTyping,
    stopTyping,
    connectedUsers,
    disconnect,
  } = useSocket();

  useEffect(() => {
    if (isConnected) {
      const cleanup = initSocket();
      return () => cleanup();
    }
  }, [initSocket, isConnected]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleInputChange = (e: InputChangeEvent) => {
    setNewMessage(e.target.value);
    startTyping();
  };

  const handleInputBlur = () => {
    stopTyping();
  };

  const handleLoginSuccess = () => {
    setIsConnectedState(true);
    setConnected(true);
  };

  const handleLogout = () => {
    disconnect();
    setIsConnectedState(false);

    // Rediriger vers la page d'accueil
    window.location.href = "/";
  };

  if (!isConnected) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Chat en ligne</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Utilisateurs connectés
        </h3>
        <ul>
          {connectedUsers.map((username, index) => (
            <li key={index} className="p-2">
              {username}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Messages</h3>
        <div className="h-[500px] overflow-y-auto space-y-2 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.sender?.username === user?.username
                  ? "bg-blue-100 ml-8"
                  : "bg-gray-100"
              }`}
            >
              <span className="font-semibold text-gray-800">
                {message.sender?.username || "Anonyme"}:
              </span>
              <span className="ml-2 text-gray-700">{message.message}</span>
            </div>
          ))}
          <UserTyping />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="Écrivez un message"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default SocketClient;
