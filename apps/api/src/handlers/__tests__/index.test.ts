import { Server, Socket } from "socket.io";
import { describe, expect, it, vi } from "vitest";
import { setupAuthHandlers } from "../authHandlers";
import { setupConnectionHandlers } from "../connectionHandlers";
import { setupSocketHandlers } from "../index";
import { setupMessageHandlers } from "../messageHandlers";
import { setupTypingHandlers } from "../typingHandlers";

vi.mock("../authHandlers", () => ({
  setupAuthHandlers: vi.fn(),
}));

vi.mock("../connectionHandlers", () => ({
  setupConnectionHandlers: vi.fn(),
}));

vi.mock("../messageHandlers", () => ({
  setupMessageHandlers: vi.fn(),
}));

vi.mock("../typingHandlers", () => ({
  setupTypingHandlers: vi.fn(),
}));

describe("handlers/index", () => {
  it("devrait initialiser tous les handlers dans le bon ordre", () => {
    const io = {} as Server;
    const socket = {} as Socket;

    setupSocketHandlers(io, socket);

    expect(setupConnectionHandlers).toHaveBeenCalledWith(io, socket);
    expect(setupAuthHandlers).toHaveBeenCalledWith(io, socket);
    expect(setupMessageHandlers).toHaveBeenCalledWith(io, socket);
    expect(setupTypingHandlers).toHaveBeenCalledWith(io, socket);

    expect(
      vi.mocked(setupConnectionHandlers).mock.invocationCallOrder[0]
    ).toBeLessThan(vi.mocked(setupAuthHandlers).mock.invocationCallOrder[0]);

    expect(
      vi.mocked(setupAuthHandlers).mock.invocationCallOrder[0]
    ).toBeLessThan(vi.mocked(setupMessageHandlers).mock.invocationCallOrder[0]);

    expect(
      vi.mocked(setupMessageHandlers).mock.invocationCallOrder[0]
    ).toBeLessThan(vi.mocked(setupTypingHandlers).mock.invocationCallOrder[0]);
  });

  it("devrait transmettre les mêmes instances io et socket à tous les handlers", () => {
    const io = { id: "server-1" } as unknown as Server;
    const socket = { id: "socket-1" } as unknown as Socket;

    setupSocketHandlers(io, socket);

    const handlers = [
      setupConnectionHandlers,
      setupAuthHandlers,
      setupMessageHandlers,
      setupTypingHandlers,
    ];

    handlers.forEach((handler) => {
      const calls = vi.mocked(handler).mock.calls;
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(io);
      expect(calls[0][1]).toBe(socket);
    });
  });
});
