import { Server, Socket } from "socket.io";
import { userService } from "../services/UserService";

/**
 * Gère les événements liés à l'authentification des utilisateurs
 */
export function setupAuthHandlers(io: Server, socket: Socket): void {
  // Vérification du pseudo
  socket.on("check_pseudo", (pseudo: string) => {
    console.log(`Vérification du pseudo: ${pseudo}`);

    if (pseudo.length < 4) {
      socket.emit("pseudo_status", {
        status: "too_short",
        message: "Pseudo must be at least 4 characters long.",
      });
    } else if (userService.isUsernameTaken(pseudo)) {
      socket.emit("pseudo_status", {
        status: "taken",
        message: "This pseudo is already taken.",
      });
    } else {
      userService.addUser(socket.id, pseudo);
      socket.emit("pseudo_status", {
        status: "available",
        message: "Pseudo accepted!",
      });

      io.emit("connected_users", userService.getAllUsers());
    }
  });

  // Gestion de l'arrivée d'un utilisateur
  socket.on("user:join", (data: { username: string }) => {
    console.log(`Utilisateur rejoint: ${data.username} (socket: ${socket.id})`);

    const { username } = data;
    if (username) {
      // Vérifier si le nom d'utilisateur existe déjà
      const existingSocketId = userService.findSocketIdByUsername(username);

      // Si l'utilisateur existe déjà et que c'est un socket différent, générer un nom unique
      if (existingSocketId && existingSocketId !== socket.id) {
        const uniqueUsername = userService.generateUniqueUsername(
          username,
          socket.id
        );
        console.log(
          `Le nom d'utilisateur existe déjà, utilisation de: ${uniqueUsername}`
        );
        userService.addUser(socket.id, uniqueUsername);

        // Informer le client de son nouveau nom
        socket.emit("username_updated", {
          original: username,
          updated: uniqueUsername,
        });
      } else {
        userService.addUser(socket.id, username);
      }

      // Émettre à tous les clients connectés
      io.emit("connected_users", userService.getAllUsers());
      io.emit(
        "system_message",
        `${userService.getUsernameBySocketId(socket.id)} a rejoint le chat`
      );

      console.log(
        `Liste des utilisateurs connectés: ${userService.getAllUsers()}`
      );
    }
  });

  // Gestion de la déconnexion manuelle
  socket.on("user:leave", (data: { username: string }) => {
    const username = userService.getUsernameBySocketId(socket.id);
    console.log(`Déconnexion manuelle: ${username} (socket: ${socket.id})`);

    if (username) {
      // Supprimer l'utilisateur de la liste des utilisateurs connectés
      userService.removeUser(socket.id);

      // Émettre les mises à jour
      io.emit("connected_users", userService.getAllUsers());
      io.emit("system_message", `${username} a quitté le chat`);

      console.log(
        `Liste des utilisateurs connectés après déconnexion: ${userService.getAllUsers()}`
      );
    }
  });
}
