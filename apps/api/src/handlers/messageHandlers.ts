import { Server, Socket } from "socket.io";
import { userService } from "../services/UserService";
import { messageService } from "../services/MessageService";

/**
 * Gère les événements liés aux messages
 */
export function setupMessageHandlers(io: Server, socket: Socket): void {
  // Gestion de l'envoi de message
  socket.on(
    "send_message",
    (data: { message: string; sender: { username: string; id?: string } }) => {
      console.log("Message reçu:", data);

      // Récupérer le vrai nom d'utilisateur depuis la connexion socket
      const realUsername = userService.getUsernameBySocketId(socket.id);

      if (!realUsername) {
        console.warn("Message reçu d'un utilisateur non enregistré:", data);
        return;
      }

      // Enrichir le message avec un ID et un timestamp
      const enrichedMessage = messageService.enrichMessage(
        data.message,
        realUsername,
        socket.id
      );

      console.log("Message enrichi:", enrichedMessage);

      // Diffuser le message à tous les clients
      io.emit("new_message", enrichedMessage);
    }
  );
}
