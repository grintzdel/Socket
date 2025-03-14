/**
 * Service de gestion des utilisateurs
 */
class UserService {
  // Map pour stocker les utilisateurs connectés: socketId -> username
  private connectedUsers: Map<string, string> = new Map();

  /**
   * Ajoute un utilisateur à la liste des utilisateurs connectés
   */
  addUser(socketId: string, username: string): void {
    this.connectedUsers.set(socketId, username);
  }

  /**
   * Supprime un utilisateur de la liste des utilisateurs connectés
   */
  removeUser(socketId: string): string | undefined {
    const username = this.connectedUsers.get(socketId);
    if (username) {
      this.connectedUsers.delete(socketId);
    }
    return username;
  }

  /**
   * Vérifie si un nom d'utilisateur est déjà pris
   */
  isUsernameTaken(username: string): boolean {
    return [...this.connectedUsers.values()].includes(username);
  }

  /**
   * Obtient le nom d'utilisateur associé à un socketId
   */
  getUsernameBySocketId(socketId: string): string | undefined {
    return this.connectedUsers.get(socketId);
  }

  /**
   * Obtient la liste de tous les utilisateurs connectés
   */
  getAllUsers(): string[] {
    return Array.from(this.connectedUsers.values());
  }

  /**
   * Trouve l'ID de socket associé à un nom d'utilisateur
   */
  findSocketIdByUsername(username: string): string | undefined {
    for (const [socketId, name] of this.connectedUsers.entries()) {
      if (name === username) {
        return socketId;
      }
    }
    return undefined;
  }

  /**
   * Génère un nom d'utilisateur unique en cas de conflit
   */
  generateUniqueUsername(username: string, socketId: string): string {
    return `${username}_${socketId.slice(-4)}`;
  }
}

// Exporter une instance singleton
export const userService = new UserService();
