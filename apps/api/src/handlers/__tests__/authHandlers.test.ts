import { describe, it, expect, vi, beforeEach } from "vitest";
import { Server, Socket } from "socket.io";
import { setupAuthHandlers } from "../authHandlers";
import { userService } from "../../services/UserService";

vi.mock("../../services/UserService", () => ({
  userService: {
    isUsernameTaken: vi.fn(),
    addUser: vi.fn(),
    getAllUsers: vi.fn(),
    findSocketIdByUsername: vi.fn(),
    generateUniqueUsername: vi.fn(),
    getUsernameBySocketId: vi.fn(),
    removeUser: vi.fn(),
  },
}));
