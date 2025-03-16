# Backend Chat API

Serveur Socket.IO pour la gestion du chat en temps réel.

## Structure du code

```
src/
├── handlers/      # Gestionnaires d'événements Socket.IO
├── services/      # Services (gestion des utilisateurs, messages, etc.)
└── server.ts      # Point d'entrée du serveur
```

## Événements Socket.IO

### Émis par le client

- `user:join` : Connexion d'un utilisateur
- `user:leave` : Déconnexion d'un utilisateur
- `send_message` : Envoi d'un message
- `typing_start` : Début de frappe
- `typing_end` : Fin de frappe

### Émis par le serveur

- `connected_users` : Liste des utilisateurs connectés
- `new_message` : Nouveau message
- `user_typing` : Utilisateurs en train de taper
- `system_message` : Messages système

## Scripts disponibles

```bash
# Développement
pnpm dev

# Build
pnpm build

# Production
pnpm start:prod

# Tests
pnpm test
```

## Tests

Les tests sont écrits avec Vitest et se trouvent dans les dossiers `src/handlers||services/__tests__`.
