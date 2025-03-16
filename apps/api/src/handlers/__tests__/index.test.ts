import { vi } from "vitest";

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
