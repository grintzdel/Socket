import {createContext, useContext, useState, type ReactNode} from 'react';
import type {Message, ChatContextType} from '../types/chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatProviderProps = {
    children: ReactNode;
};

export const ChatProvider = ({children}: ChatProviderProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const addMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                addMessage,
                typingUsers,
                setTypingUsers
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext doit être utilisé dans un ChatProvider');
    }
    return context;
};