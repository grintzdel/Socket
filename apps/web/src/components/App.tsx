import React from "react";
import "../App.css";
import { ChatProvider } from "./ChatProvider";
import { UserProvider } from "./UserProvider";
import SocketClient from "./SocketClient";

const App: React.FC = () => {
  return (
    <UserProvider>
      <ChatProvider>
        <SocketClient />
      </ChatProvider>
    </UserProvider>
  );
};

export default App;
