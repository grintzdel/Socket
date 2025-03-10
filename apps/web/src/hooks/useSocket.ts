import {useRef, useCallback} from 'react';
import {io, type Socket} from 'socket.io-client';
import {useChatContext} from '../context/ChatContext';
import {useUserContext} from '../context/UserContext';
import type {SocketHookReturn} from '../types/chat';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = (): SocketHookReturn => {
    const socketRef = useRef<Socket | null>(null);
    const {addMessage, setTypingUsers} = useChatContext();
    const {user} = useUserContext();

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

        if (user?.username) {
            socket.emit('user:join', {username: user.username});
        }

        return () => {
            socket.disconnect();
        };
    }, [addMessage, setTypingUsers, user]);

    const sendMessage = useCallback((message: string) => {
        if (!socketRef.current || !message.trim() || !user?.username) return;

        socketRef.current.emit('send_message', {
            message,
            sender: {
                username: user.username
            }
        });
    }, [user]);

    const startTyping = useCallback(() => {
        if (!socketRef.current || !user?.username) return;
        socketRef.current.emit('typing_start', {username: user.username});
    }, [user]);

    const stopTyping = useCallback(() => {
        if (!socketRef.current || !user?.username) return;
        socketRef.current.emit('typing_end', {username: user.username});
    }, [user]);

    return {
        socket: socketRef.current,
        initSocket,
        sendMessage,
        startTyping,
        stopTyping
    };
};