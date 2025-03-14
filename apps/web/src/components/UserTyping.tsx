import React from "react";
import { useChatContext } from "../hooks/useChatContext.ts";
import { useUserContext } from "../hooks/useUserContext.ts";

const UserTyping: React.FC = () => {
  const { typingUsers } = useChatContext();
  const { user } = useUserContext();

  // Filtrer l'utilisateur actuel de la liste des utilisateurs en train de taper
  const filteredTypingUsers = typingUsers.filter(
    (username) => username !== user?.username
  );

  if (filteredTypingUsers.length === 0) {
    return null;
  }

  const typingText =
    filteredTypingUsers.length === 1
      ? `${filteredTypingUsers[0]} est en train d'écrire...`
      : `${filteredTypingUsers.join(", ")} sont en train d'écrire...`;

  return (
    <div className="text-sm text-gray-500 italic mt-2 mb-2">{typingText}</div>
  );
};

export default UserTyping;
