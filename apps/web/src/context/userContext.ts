import { createContext } from "react";
import type { UserContextType } from "../types/chat";

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
