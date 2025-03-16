import { describe, it, expect, beforeEach } from "vitest";
import { typingService } from "../TypingService";

describe("TypingService", () => {
  beforeEach(() => {
    typingService["typingUsers"].clear();
  });

  describe("addTypingUser", () => {
    it("devrait ajouter un utilisateur à la liste", () => {
      typingService.addTypingUser("user1");
      expect(typingService.isUserTyping("user1")).toBe(true);
    });

    it("ne devrait pas dupliquer un utilisateur", () => {
      typingService.addTypingUser("user1");
      typingService.addTypingUser("user1");
      expect(typingService.getAllTypingUsers()).toHaveLength(1);
    });
  });

  describe("removeTypingUser", () => {
    it("devrait supprimer un utilisateur de la liste", () => {
      typingService.addTypingUser("user1");
      typingService.removeTypingUser("user1");
      expect(typingService.isUserTyping("user1")).toBe(false);
    });

    it("ne devrait pas échouer si l'utilisateur n'existe pas", () => {
      expect(() => typingService.removeTypingUser("nonexistent")).not.toThrow();
    });
  });

  describe("isUserTyping", () => {
    it("devrait retourner true pour un utilisateur qui tape", () => {
      typingService.addTypingUser("user1");
      expect(typingService.isUserTyping("user1")).toBe(true);
    });

    it("devrait retourner false pour un utilisateur qui ne tape pas", () => {
      expect(typingService.isUserTyping("user2")).toBe(false);
    });
  });

  describe("getAllTypingUsers", () => {
    it("devrait retourner la liste de tous les utilisateurs qui tapent", () => {
      typingService.addTypingUser("user1");
      typingService.addTypingUser("user2");
      expect(typingService.getAllTypingUsers()).toEqual(["user1", "user2"]);
    });

    it("devrait retourner un tableau vide si personne ne tape", () => {
      expect(typingService.getAllTypingUsers()).toEqual([]);
    });
  });
});
