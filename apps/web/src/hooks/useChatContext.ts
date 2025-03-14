import { useContext } from "react";
import { ChatContext } from "../context/chatContext.ts";

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext doit être utilisé dans un ChatProvider");
  }
  return context;
};
