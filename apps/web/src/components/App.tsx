import React from 'react';
import {UserProvider} from '../context/UserContext.tsx';
import {ChatProvider} from '../context/ChatContext.tsx';
import SocketClient from './SocketClient.tsx';
import '../App.css';

const App: React.FC = () => {
    return (
        <UserProvider>
            <ChatProvider>
                <SocketClient/>
            </ChatProvider>
        </UserProvider>
    );
};

export default App;