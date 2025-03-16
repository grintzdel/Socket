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

describe("connectionHandlers", () => {
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

    setupConnectionHandlers(io, socket);
  });

  describe("disconnect", () => {
    it("devrait gérer la déconnexion d'un utilisateur connu", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("user1");
      vi.mocked(userService.getAllUsers).mockReturnValue(["user2"]);
      vi.mocked(typingService.getAllTypingUsers).mockReturnValue(["user2"]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "disconnect"
      )[1];

      handler();

      expect(userService.removeUser).toHaveBeenCalledWith("socket-id-1");
      expect(typingService.removeTypingUser).toHaveBeenCalledWith("user1");
      expect(ioEmitSpy).toHaveBeenCalledWith("connected_users", ["user2"]);
      expect(ioEmitSpy).toHaveBeenCalledWith("user_typing", ["user2"]);
      expect(ioEmitSpy).toHaveBeenCalledWith(
        "system_message",
        "user1 a quitté le chat"
      );
    });

    it("ne devrait pas émettre d'événements pour un utilisateur inconnu", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue(undefined);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "disconnect"
      )[1];

      handler();

      expect(userService.removeUser).not.toHaveBeenCalled();
      expect(typingService.removeTypingUser).not.toHaveBeenCalled();
      expect(ioEmitSpy).not.toHaveBeenCalled();
    });

    it("devrait mettre à jour les listes même si l'utilisateur n'était pas en train de taper", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("user1");
      vi.mocked(userService.getAllUsers).mockReturnValue([]);
      vi.mocked(typingService.getAllTypingUsers).mockReturnValue([]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "disconnect"
      )[1];

      handler();

      expect(userService.removeUser).toHaveBeenCalledWith("socket-id-1");
      expect(typingService.removeTypingUser).toHaveBeenCalledWith("user1");
      expect(ioEmitSpy).toHaveBeenCalledWith("connected_users", []);
      expect(ioEmitSpy).toHaveBeenCalledWith("user_typing", []);
      expect(ioEmitSpy).toHaveBeenCalledWith(
        "system_message",
        "user1 a quitté le chat"
      );
    });
  });
});
