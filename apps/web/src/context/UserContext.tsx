import {createContext, useContext, useState, type ReactNode} from 'react';
import type {User, UserContextType} from '../types/chat';

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext doit être utilisé dans un UserProvider');
    }
    return context;
};