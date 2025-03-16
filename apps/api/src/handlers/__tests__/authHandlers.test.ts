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

describe("authHandlers", () => {
  let io: Server;
  let socket: Socket;
  let socketEmitSpy: any;
  let ioEmitSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();

    socketEmitSpy = vi.fn();
    ioEmitSpy = vi.fn();

    socket = {
      id: "socket-id-1",
      emit: socketEmitSpy,
      on: vi.fn(),
    } as unknown as Socket;

    io = {
      emit: ioEmitSpy,
    } as unknown as Server;
  });

  describe("check_pseudo", () => {
    beforeEach(() => {
      setupAuthHandlers(io, socket);
    });

    it("devrait rejeter un pseudo trop court", () => {
      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "check_pseudo"
      )[1];

      handler("abc");

      expect(socketEmitSpy).toHaveBeenCalledWith("pseudo_status", {
        status: "too_short",
        message: "Pseudo must be at least 4 characters long.",
      });
    });

    it("devrait rejeter un pseudo déjà pris", () => {
      vi.mocked(userService.isUsernameTaken).mockReturnValue(true);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "check_pseudo"
      )[1];

      handler("pseudo1");

      expect(socketEmitSpy).toHaveBeenCalledWith("pseudo_status", {
        status: "taken",
        message: "This pseudo is already taken.",
      });
    });

    it("devrait accepter un pseudo valide", () => {
      vi.mocked(userService.isUsernameTaken).mockReturnValue(false);
      vi.mocked(userService.getAllUsers).mockReturnValue(["pseudo1"]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "check_pseudo"
      )[1];

      handler("pseudo1");

      expect(userService.addUser).toHaveBeenCalledWith(
        "socket-id-1",
        "pseudo1"
      );
      expect(socketEmitSpy).toHaveBeenCalledWith("pseudo_status", {
        status: "available",
        message: "Pseudo accepted!",
      });
      expect(ioEmitSpy).toHaveBeenCalledWith("connected_users", ["pseudo1"]);
    });
  });

  describe("user:join", () => {
    beforeEach(() => {
      setupAuthHandlers(io, socket);
    });

    it("devrait gérer un nouveau utilisateur", () => {
      vi.mocked(userService.findSocketIdByUsername).mockReturnValue(undefined);
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("pseudo1");
      vi.mocked(userService.getAllUsers).mockReturnValue(["pseudo1"]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "user:join"
      )[1];

      handler({ username: "pseudo1" });

      expect(userService.addUser).toHaveBeenCalledWith(
        "socket-id-1",
        "pseudo1"
      );
      expect(ioEmitSpy).toHaveBeenCalledWith("connected_users", ["pseudo1"]);
      expect(ioEmitSpy).toHaveBeenCalledWith(
        "system_message",
        "pseudo1 a rejoint le chat"
      );
    });

    it("devrait gérer un nom d'utilisateur en doublon", () => {
      vi.mocked(userService.findSocketIdByUsername).mockReturnValue(
        "autre-socket"
      );
      vi.mocked(userService.generateUniqueUsername).mockReturnValue(
        "pseudo1_123"
      );
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue(
        "pseudo1_123"
      );
      vi.mocked(userService.getAllUsers).mockReturnValue([
        "pseudo1",
        "pseudo1_123",
      ]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "user:join"
      )[1];

      handler({ username: "pseudo1" });

      expect(socketEmitSpy).toHaveBeenCalledWith("username_updated", {
        original: "pseudo1",
        updated: "pseudo1_123",
      });
      expect(userService.addUser).toHaveBeenCalledWith(
        "socket-id-1",
        "pseudo1_123"
      );
    });
  });

  describe("user:leave", () => {
    beforeEach(() => {
      setupAuthHandlers(io, socket);
    });

    it("devrait gérer la déconnexion d'un utilisateur", () => {
      vi.mocked(userService.getUsernameBySocketId).mockReturnValue("pseudo1");
      vi.mocked(userService.getAllUsers).mockReturnValue([]);

      const handler = (socket.on as any).mock.calls.find(
        ([event]: any) => event === "user:leave"
      )[1];

      handler({ username: "pseudo1" });

      expect(userService.removeUser).toHaveBeenCalledWith("socket-id-1");
      expect(ioEmitSpy).toHaveBeenCalledWith("connected_users", []);
      expect(ioEmitSpy).toHaveBeenCalledWith(
        "system_message",
        "pseudo1 a quitté le chat"
      );
    });
  });
});
