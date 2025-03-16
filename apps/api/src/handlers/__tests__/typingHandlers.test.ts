import { vi } from "vitest";

vi.mock("../../services/UserService", () => ({
  userService: {
    getUsernameBySocketId: vi.fn(),
  },
}));

vi.mock("../../services/TypingService", () => ({
  typingService: {
    addTypingUser: vi.fn(),
    removeTypingUser: vi.fn(),
    getAllTypingUsers: vi.fn(),
  },
}));
