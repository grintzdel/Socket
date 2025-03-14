import { Server, Socket } from "socket.io";
import { userService } from "../services/UserService";
import { typingService } from "../services/TypingService";

/**
 * Gère les événements liés à l'action de taper un message
 */
export function setupTypingHandlers(io: Server, socket: Socket): void {
  // Gestion de l'utilisateur commence à taper
  socket.on("typing_start", (data: { username: string }) => {
    const username = userService.getUsernameBySocketId(socket.id);
    if (username) {
      typingService.addTypingUser(username);
      io.emit("user_typing", typingService.getAllTypingUsers());
    }
  });

  // Gestion de l'utilisateur arrête de taper
  socket.on("typing_end", (data: { username: string }) => {
    const username = userService.getUsernameBySocketId(socket.id);
    if (username) {
      typingService.removeTypingUser(username);
      io.emit("user_typing", typingService.getAllTypingUsers());
    }
  });
}
