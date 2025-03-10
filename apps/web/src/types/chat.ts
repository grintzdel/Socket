import type {Socket} from 'socket.io-client'

export type User = {
    id?: string;
    username?: string;
};

export type Message = {
    id?: string;
    message: string;
    sender?: {
        id: string;
        username: string;
    };
    timestamp?: number;
};

export type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export type ChatContextType = {
    messages: Message[];
    addMessage: (message: Message) => void;
    typingUsers: string[];
    setTypingUsers: (users: string[]) => void;
};

export type SocketHookReturn = {
    socket: Socket | null;
    initSocket: () => () => void;
    sendMessage: (message: string) => void;
    startTyping: () => void;
    stopTyping: () => void;
    connectedUsers: string[];
};