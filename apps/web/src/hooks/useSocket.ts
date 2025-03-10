import {useRef, useCallback} from 'react';
import {io, type Socket} from 'socket.io-client';
import {useChatContext} from '../context/ChatContext';
import type {SocketHookReturn} from '../types/chat';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = (): SocketHookReturn => {
    const socketRef = useRef<Socket | null>(null);
    const {addMessage, setTypingUsers} = useChatContext();

    const initSocket = useCallback(() => {
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true
        });

        const socket = socketRef.current;

        socket.on('connection_success', (data: { status: string; socketId: string }) => {
            console.log('Connecté au serveur:', data);
        });

        socket.on('new_message', (message) => {
            addMessage(message);
        });

        socket.on('user_typing', (users: string[]) => {
            setTypingUsers(users);
        });

        return () => {
            socket.disconnect();
        };
    }, [addMessage, setTypingUsers]);

    const sendMessage = useCallback((message: string) => {
        if (!socketRef.current || !message.trim()) return;

        socketRef.current.emit('send_message', {message});
    }, []);

    const startTyping = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.emit('typing_start');
    }, []);

    const stopTyping = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.emit('typing_end');
    }, []);

    return {
        socket: socketRef.current,
        initSocket,
        sendMessage,
        startTyping,
        stopTyping
    };
};