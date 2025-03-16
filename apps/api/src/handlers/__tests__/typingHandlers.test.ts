import { Server, Socket } from "socket.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { typingService } from "../../services/TypingService";
import { userService } from "../../services/UserService";
import { setupTypingHandlers } from "../typingHandlers";

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

describe("typingHandlers", () => {
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

    setupTypingHandlers(io, socket);
  });

  describe("typing_start", () => {
    const mockTypingData = { username: "user1" };

    it("devrait gérer le début de frappe d'un utilisateur enregistré", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("realUser");
      vi.mocked(typingService.getAllTypingUsers).mockReturnValue([
        "realUser",
        "otherUser",
      ]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "typing_start"
      )[1];

      handler(mockTypingData);

      expect(typingService.addTypingUser).toHaveBeenCalledWith("realUser");
      expect(ioEmitSpy).toHaveBeenCalledWith("user_typing", [
        "realUser",
        "otherUser",
      ]);
    });

    it("ne devrait rien faire pour un utilisateur non enregistré", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue(undefined);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "typing_start"
      )[1];

      handler(mockTypingData);

      expect(typingService.addTypingUser).not.toHaveBeenCalled();
      expect(ioEmitSpy).not.toHaveBeenCalled();
    });
  });

  describe("typing_end", () => {
    const mockTypingData = { username: "user1" };

    it("devrait gérer la fin de frappe d'un utilisateur enregistré", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("realUser");
      vi.mocked(typingService.getAllTypingUsers).mockReturnValue(["otherUser"]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "typing_end"
      )[1];

      handler(mockTypingData);

      expect(typingService.removeTypingUser).toHaveBeenCalledWith("realUser");
      expect(ioEmitSpy).toHaveBeenCalledWith("user_typing", ["otherUser"]);
    });

    it("ne devrait rien faire pour un utilisateur non enregistré", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue(undefined);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "typing_end"
      )[1];

      handler(mockTypingData);

      expect(typingService.removeTypingUser).not.toHaveBeenCalled();
      expect(ioEmitSpy).not.toHaveBeenCalled();
    });

    it("devrait ignorer le nom d'utilisateur fourni et utiliser celui du socket", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("realUser");
      vi.mocked(typingService.getAllTypingUsers).mockReturnValue([]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "typing_end"
      )[1];

      handler({ username: "fakeUser" });

      expect(typingService.removeTypingUser).toHaveBeenCalledWith("realUser");
      expect(ioEmitSpy).toHaveBeenCalledWith("user_typing", []);
    });
  });
});
