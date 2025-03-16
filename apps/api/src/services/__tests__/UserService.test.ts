import { describe, it, expect, beforeEach } from "vitest";
import { userService } from "../UserService";

describe("UserService", () => {
  beforeEach(() => {
    userService.reset();
  });

  describe("addUser", () => {
    it("devrait ajouter un utilisateur avec succès", () => {
      userService.addUser("socket123", "jean");

      expect(userService.getUsernameBySocketId("socket123")).toBe("jean");
      expect(userService.getAllUsers()).toContain("jean");
    });
  });

  describe("isUsernameTaken", () => {
    it("devrait retourner true si le nom est déjà pris", () => {
      userService.addUser("socket123", "jean");

      expect(userService.isUsernameTaken("jean")).toBe(true);
    });

    it("devrait retourner false si le nom est disponible", () => {
      expect(userService.isUsernameTaken("pierre")).toBe(false);
    });
  });

  describe("removeUser", () => {
    it("devrait supprimer un utilisateur avec succès", () => {
      userService.addUser("socket123", "jean");

      const removedUsername = userService.removeUser("socket123");

      expect(removedUsername).toBe("jean");
      expect(userService.getUsernameBySocketId("socket123")).toBeUndefined();
      expect(userService.getAllUsers()).not.toContain("jean");
    });

    it("devrait retourner undefined si le socket n'existe pas", () => {
      expect(userService.removeUser("socketInexistant")).toBeUndefined();
    });
  });

  describe("generateUniqueUsername", () => {
    it("devrait générer un nom unique avec le suffixe du socketId", () => {
      const socketId = "abcd1234";
      const username = "jean";

      const uniqueUsername = userService.generateUniqueUsername(
        username,
        socketId
      );

      expect(uniqueUsername).toBe("jean_1234");
    });
  });
});
