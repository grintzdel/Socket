import type { Message, User } from "../types/chat";

// Clés de stockage
const STORAGE_KEYS = {
  CONNECTED: "chatConnected",
  MESSAGES: "chat_messages",
  USER: "chat_user",
};

/**
 * Obtient l'utilisateur depuis le localStorage
 */
export const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

/**
 * Sauvegarde l'utilisateur dans le localStorage
 */
export const storeUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'utilisateur:", error);
  }
};

/**
 * Obtient les messages depuis le localStorage
 */
export const getStoredMessages = (): Message[] => {
  try {
    const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return [];
  }
};

/**
 * Sauvegarde les messages dans le localStorage
 */
export const storeMessages = (messages: Message[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des messages:", error);
  }
};

/**
 * Définit l'état de connexion dans le localStorage
 */
export const setConnected = (connected: boolean): void => {
  if (connected) {
    localStorage.setItem(STORAGE_KEYS.CONNECTED, "true");
  } else {
    localStorage.removeItem(STORAGE_KEYS.CONNECTED);
  }
};

/**
 * Vérifie si l'utilisateur est connecté selon le localStorage
 */
export const isConnected = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.CONNECTED) === "true";
};

/**
 * Nettoie toutes les données du chat dans le localStorage
 */
export const clearChatStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CONNECTED);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.USER);
};
