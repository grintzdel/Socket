import React, { useState } from "react";
import { useUserContext } from "../hooks/useUserContext.ts";
import { storeUser } from "../utils/storage";

type LoginFormProps = {
  onLoginSuccess: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUserContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.trim().length < 2) {
      setError("Le nom d'utilisateur doit contenir au moins 2 caractères");
      return;
    }

    const userData = {
      username: username.trim(),
      id: `user_${Date.now()}`,
    };

    setUser(userData);
    storeUser(userData);
    onLoginSuccess();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Rejoindre le chat
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Votre nom d'utilisateur"
          required
          minLength={2}
          maxLength={20}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Rejoindre
        </button>
      </form>
    </div>
  );
};
