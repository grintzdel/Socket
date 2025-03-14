/**
 * Type de message enrichi
 */
export interface EnrichedMessage {
  id: string;
  message: string;
  sender: {
    username: string;
    id: string;
  };
  timestamp: number;
}

/**
 * Service de gestion des messages
 */
class MessageService {
  /**
   * Génère un identifiant unique pour le message
   */
  generateMessageId(): string {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  /**
   * Enrichit un message avec un ID et un timestamp
   */
  enrichMessage(
    message: string,
    senderUsername: string,
    senderId: string
  ): EnrichedMessage {
    return {
      id: this.generateMessageId(),
      message,
      sender: {
        username: senderUsername,
        id: senderId,
      },
      timestamp: Date.now(),
    };
  }
}

// Exporter une instance singleton
export const messageService = new MessageService();
