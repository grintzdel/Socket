import { Server, Socket } from "socket.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { typingService } from "../../services/TypingService";
import { userService } from "../../services/UserService";
import { setupConnectionHandlers } from "../connectionHandlers";

vi.mock("../../services/UserService", () => ({
  userService: {
    getUsernameBySocketId: vi.fn(),
    removeUser: vi.fn(),
    getAllUsers: vi.fn(),
  },
}));

vi.mock("../../services/TypingService", () => ({
  typingService: {
    removeTypingUser: vi.fn(),
    getAllTypingUsers: vi.fn(),
  },
}));
