import { Server, Socket } from "socket.io";
import { setupAuthHandlers } from "./authHandlers";
import { setupConnectionHandlers } from "./connectionHandlers";
import { setupMessageHandlers } from "./messageHandlers";
import { setupTypingHandlers } from "./typingHandlers";

/**
 * Configure tous les gestionnaires d'événements pour un socket
 */
export function setupSocketHandlers(io: Server, socket: Socket): void {
  // Initialiser les gestionnaires d'événements
  setupConnectionHandlers(io, socket);
  setupAuthHandlers(io, socket);
  setupMessageHandlers(io, socket);
  setupTypingHandlers(io, socket);
}
