import { Server, Socket } from "socket.io";
import { userService } from "../services/UserService";
import { typingService } from "../services/TypingService";

/**
 * Gère les événements liés à la connexion/déconnexion
 */
export function setupConnectionHandlers(io: Server, socket: Socket): void {
  console.log(`Nouvel utilisateur connecté: ${socket.id}`);

  // Gestion de la déconnexion (fermeture de navigateur, etc.)
  socket.on("disconnect", () => {
    const username = userService.getUsernameBySocketId(socket.id);
    console.log(
      `Déconnexion de socket: ${socket.id}, utilisateur: ${
        username || "inconnu"
      }`
    );

    if (username) {
      // Supprimer l'utilisateur de la liste des utilisateurs connectés
      userService.removeUser(socket.id);

      // Supprimer l'utilisateur de la liste des utilisateurs en train de taper
      typingService.removeTypingUser(username);

      // Émettre les mises à jour
      io.emit("connected_users", userService.getAllUsers());
      io.emit("user_typing", typingService.getAllTypingUsers());
      io.emit("system_message", `${username} a quitté le chat`);

      console.log(
        `Liste des utilisateurs connectés après déconnexion: ${userService.getAllUsers()}`
      );
    }
  });
}
