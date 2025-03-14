import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Message } from "../types/chat";
import { getStoredMessages, storeMessages } from "../utils/storage";
import { ChatContext } from "../context/chatContext";

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  // Initialiser les messages depuis le localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = getStoredMessages();
    console.log("Messages chargés depuis localStorage:", storedMessages);
    return storedMessages;
  });
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Sauvegarder les messages dans le localStorage quand ils changent
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Sauvegarde des messages dans localStorage:", messages);
      storeMessages(messages);
    }
  }, [messages]);

  const addMessage = useCallback((message: Message) => {
    console.log("Ajout d'un nouveau message:", message);

    // Vérifier si le message existe déjà (par ID)
    setMessages((prevMessages) => {
      // Ne pas ajouter de doublons si le message a un ID
      if (message.id && prevMessages.some((m) => m.id === message.id)) {
        console.log("Message déjà existant, ignoré:", message.id);
        return prevMessages;
      }

      const newMessages = [...prevMessages, message];
      return newMessages;
    });
  }, []);

  // Fonction pour effacer les messages (utile lors de la déconnexion)
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        typingUsers,
        setTypingUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
