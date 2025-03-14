import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useChatContext } from "./useChatContext.ts";
import { useUserContext } from "./useUserContext.ts";
import type { SocketHookReturn } from "../types/chat";
import { clearChatStorage, storeMessages } from "../utils/storage";

const SOCKET_URL = "http://localhost:3001";

export const useSocket = (): SocketHookReturn => {
  const socketRef = useRef<Socket | null>(null);
  const { messages, addMessage, setTypingUsers } = useChatContext();
  const { user, setUser } = useUserContext();

  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [socketId, setSocketId] = useState<string | null>(null);

  // Nettoyer le socket lors du démontage du composant
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Sauvegarder les messages quand ils changent
  useEffect(() => {
    if (messages.length > 0) {
      storeMessages(messages);
    }
  }, [messages]);

  const initSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("Socket déjà initialisé, réutilisation...");
      // S'assurer que l'utilisateur est bien enregistré sur le serveur
      if (user?.username && socketRef.current.connected) {
        socketRef.current.emit("user:join", { username: user.username });
      }
      return () => {};
    }

    console.log("Initialisation du socket avec l'utilisateur:", user);
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    const socket = socketRef.current;

    // Stocker l'ID du socket pour identifier cette connexion
    socket.on("connect", () => {
      console.log("Connecté avec l'ID de socket:", socket.id);
      setSocketId(socket.id || null);
    });

    socket.on(
      "connection_success",
      (data: { status: string; socketId: string }) => {
        console.log("Connecté au serveur:", data);
      }
    );

    socket.on("new_message", (message) => {
      console.log("Message reçu:", message);
      addMessage(message);
    });

    socket.on("user_typing", (users: string[]) => {
      console.log("Utilisateurs en train de taper:", users);
      setTypingUsers(users);
    });

    socket.on("connected_users", (users: string[]) => {
      console.log("Utilisateurs connectés:", users);
      setConnectedUsers(users);
    });

    socket.on("system_message", (message: string) => {
      console.log("Message système:", message);
      // On peut éventuellement afficher les messages système
    });

    socket.on("connect_error", (error) => {
      console.error("Erreur de connexion au serveur:", error);
    });

    socket.on("error", (error) => {
      console.error("Erreur socket:", error);
    });

    // Envoyer l'identité de l'utilisateur seulement si l'utilisateur existe
    if (user?.username) {
      console.log("Émission de l'événement user:join avec:", user.username);
      socket.emit("user:join", { username: user.username });
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [addMessage, setTypingUsers, user]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!socketRef.current || !message.trim() || !user?.username) {
        console.error("Impossible d'envoyer le message:", {
          socketExists: !!socketRef.current,
          messageValid: !!message.trim(),
          userExists: !!user?.username,
        });
        return;
      }

      console.log("Envoi du message:", message, "par", user.username);
      socketRef.current.emit("send_message", {
        message,
        sender: {
          username: user.username,
          id: socketId || "unknown",
        },
      });
    },
    [user, socketId]
  );

  const startTyping = useCallback(() => {
    if (!socketRef.current || !user?.username) return;
    socketRef.current.emit("typing_start", { username: user.username });
  }, [user]);

  const stopTyping = useCallback(() => {
    if (!socketRef.current || !user?.username) return;
    socketRef.current.emit("typing_end", { username: user.username });
  }, [user]);

  const disconnect = useCallback(() => {
    if (!socketRef.current || !user?.username) return;

    console.log("Déconnexion de l'utilisateur:", user.username);

    // Informer le serveur de la déconnexion
    socketRef.current.emit("user:leave", { username: user.username });

    // Nettoyer le localStorage
    clearChatStorage();

    // Déconnecter le socket
    socketRef.current.disconnect();
    socketRef.current = null;
    setSocketId(null);

    // Réinitialiser l'utilisateur
    setUser(null);

    return true;
  }, [user, setUser]);

  return {
    socket: socketRef.current,
    initSocket,
    sendMessage,
    startTyping,
    stopTyping,
    connectedUsers,
    disconnect,
  };
};
