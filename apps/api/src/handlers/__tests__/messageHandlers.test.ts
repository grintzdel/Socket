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

describe("messageHandlers", () => {
  let io: Server;
  let socket: Socket;
  let ioEmitSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();

    ioEmitSpy = vi.fn();

    socket = {
      id: "socket-id-1",
      on: vi.fn(),
    } as unknown as Socket;

    io = {
      emit: ioEmitSpy,
    } as unknown as Server;

    setupMessageHandlers(io, socket);
  });

  describe("send_message", () => {
    const mockMessage = {
      message: "Hello world!",
      sender: {
        username: "user1",
        id: "some-id",
      },
    };

    const mockEnrichedMessage = {
      id: "msg_123",
      message: "Hello world!",
      sender: {
        username: "realUser",
        id: "socket-id-1",
      },
      timestamp: 1234567890,
    };

    it("devrait enrichir et diffuser un message d'un utilisateur enregistré", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("realUser");
      vi.mocked(messageService.enrichMessage).mockReturnValue(
        mockEnrichedMessage
      );

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "send_message"
      )[1];

      handler(mockMessage);

      expect(messageService.enrichMessage).toHaveBeenCalledWith(
        "Hello world!",
        "realUser",
        "socket-id-1"
      );
      expect(ioEmitSpy).toHaveBeenCalledWith(
        "new_message",
        mockEnrichedMessage
      );
    });

    it("ne devrait pas diffuser de message d'un utilisateur non enregistré", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue(undefined);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "send_message"
      )[1];

      handler(mockMessage);

      expect(messageService.enrichMessage).not.toHaveBeenCalled();
      expect(ioEmitSpy).not.toHaveBeenCalled();
    });

    it("devrait utiliser le vrai nom d'utilisateur plutôt que celui fourni", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("realUser");
      vi.mocked(messageService.enrichMessage).mockReturnValue(
        mockEnrichedMessage
      );

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "send_message"
      )[1];

      const messageWithFakeUser = {
        message: "Hello world!",
        sender: {
          username: "fakeUser",
          id: "fake-id",
        },
      };

      handler(messageWithFakeUser);

      expect(messageService.enrichMessage).toHaveBeenCalledWith(
        "Hello world!",
        "realUser",
        "socket-id-1"
      );
    });
  });
});
