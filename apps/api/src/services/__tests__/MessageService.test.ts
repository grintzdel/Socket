import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { messageService } from "../MessageService";

describe("MessageService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("generateMessageId", () => {
    it("devrait générer un ID unique avec le format attendu", () => {
      // Fixer la date et le random pour un test déterministe
      const mockDate = new Date("2024-03-16T12:00:00Z");
      vi.setSystemTime(mockDate);
      vi.spyOn(Math, "random").mockReturnValue(0.123);

      const messageId = messageService.generateMessageId();

      expect(messageId).toMatch(/^msg_\d+_\d+$/);
      expect(messageId).toBe("msg_1710590400000_123");
    });

    it("devrait générer des IDs différents à chaque appel", () => {
      const id1 = messageService.generateMessageId();
      const id2 = messageService.generateMessageId();

      expect(id1).not.toBe(id2);
    });
  });

  describe("enrichMessage", () => {
    it("devrait enrichir un message avec les informations requises", () => {
      const mockDate = new Date("2024-03-16T12:00:00Z");
      vi.setSystemTime(mockDate);
      vi.spyOn(messageService, "generateMessageId").mockReturnValue(
        "msg_test_123"
      );

      const message = "Hello, world!";
      const username = "testUser";
      const userId = "user123";

      const enrichedMessage = messageService.enrichMessage(
        message,
        username,
        userId
      );

      expect(enrichedMessage).toEqual({
        id: "msg_test_123",
        message: "Hello, world!",
        sender: {
          username: "testUser",
          id: "user123",
        },
        timestamp: mockDate.getTime(),
      });
    });

    it("devrait préserver le message original", () => {
      const messageWithSpaces = "  Message avec des espaces  ";
      const enrichedMessage = messageService.enrichMessage(
        messageWithSpaces,
        "user",
        "id123"
      );

      expect(enrichedMessage.message).toBe(messageWithSpaces);
    });
  });
});
