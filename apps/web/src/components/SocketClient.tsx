import React, {useEffect, useState, type ChangeEvent} from 'react';
import {useSocket} from '../hooks/useSocket';
import {useChatContext} from '../context/ChatContext';

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

const SocketClient: React.FC = () => {
    const [newMessage, setNewMessage] = useState<string>('');
    const {messages} = useChatContext();
    const {initSocket, sendMessage, startTyping, stopTyping} = useSocket();

    useEffect(() => {
        const cleanup = initSocket();
        return () => cleanup();
    }, [initSocket]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    const handleInputChange = (e: InputChangeEvent) => {
        setNewMessage(e.target.value);
        startTyping();
    };

    const handleInputBlur = () => {
        stopTyping();
    };

    return (
        <div>
            <h2>Client Socket.io</h2>

            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="Écrivez un message"
                />
                <button onClick={handleSendMessage}>Envoyer</button>
            </div>

            <div>
                <h3>Messages</h3>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message.message}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SocketClient;