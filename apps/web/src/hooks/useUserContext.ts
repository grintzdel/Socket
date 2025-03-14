import { useContext } from "react";
import { UserContext } from "../context/userContext.ts";

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext doit être utilisé dans un UserProvider");
  }
  return context;
};
