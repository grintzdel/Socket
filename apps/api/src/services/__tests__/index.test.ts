import { describe, it, expect } from "vitest";
import { userService, typingService, messageService } from "../index";

describe("Services index", () => {
  it("devrait exporter userService", () => {
    expect(userService).toBeDefined();
    expect(typeof userService.addUser).toBe("function");
    expect(typeof userService.removeUser).toBe("function");
    expect(typeof userService.isUsernameTaken).toBe("function");
  });

  it("devrait exporter typingService", () => {
    expect(typingService).toBeDefined();
    expect(typeof typingService.addTypingUser).toBe("function");
    expect(typeof typingService.removeTypingUser).toBe("function");
    expect(typeof typingService.isUserTyping).toBe("function");
    expect(typeof typingService.getAllTypingUsers).toBe("function");
  });

  it("devrait exporter messageService", () => {
    expect(messageService).toBeDefined();
    expect(typeof messageService.generateMessageId).toBe("function");
    expect(typeof messageService.enrichMessage).toBe("function");
  });

  it("devrait exporter des instances singleton", () => {
    const {
      userService: userService2,
      typingService: typingService2,
      messageService: messageService2,
    } = require("../index");
    expect(userService2).toBe(userService);
    expect(typingService2).toBe(typingService);
    expect(messageService2).toBe(messageService);
  });
});
