import { useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/chat";
import { getStoredUser, storeUser } from "../utils/storage";
import { UserContext } from "../context/userContext";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  // Initialiser l'utilisateur depuis le localStorage
  const [user, setUser] = useState<User | null>(() => {
    return getStoredUser();
  });

  // Sauvegarder l'utilisateur dans le localStorage quand il change
  useEffect(() => {
    if (user) {
      storeUser(user);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
