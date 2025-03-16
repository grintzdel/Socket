import { Server, Socket } from "socket.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { messageService } from "../../services/MessageService";
import { userService } from "../../services/UserService";
import { setupMessageHandlers } from "../messageHandlers";

vi.mock("../../services/UserService", () => ({
  userService: {
    getUsernameBySocketId: vi.fn(),
  },
}));

vi.mock("../../services/MessageService", () => ({
  messageService: {
    enrichMessage: vi.fn(),
  },
}));