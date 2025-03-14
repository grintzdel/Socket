/**
 * Service de gestion des utilisateurs en train de taper
 */
class TypingService {
  // Set pour suivre les utilisateurs en train de taper
  private typingUsers: Set<string> = new Set();

  /**
   * Ajoute un utilisateur à la liste des utilisateurs en train de taper
   */
  addTypingUser(username: string): void {
    this.typingUsers.add(username);
  }

  /**
   * Supprime un utilisateur de la liste des utilisateurs en train de taper
   */
  removeTypingUser(username: string): void {
    this.typingUsers.delete(username);
  }

  /**
   * Vérifie si un utilisateur est en train de taper
   */
  isUserTyping(username: string): boolean {
    return this.typingUsers.has(username);
  }

  /**
   * Obtient la liste de tous les utilisateurs en train de taper
   */
  getAllTypingUsers(): string[] {
    return Array.from(this.typingUsers);
  }
}

// Exporter une instance singleton
export const typingService = new TypingService();
