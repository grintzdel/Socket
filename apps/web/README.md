# Frontend Chat Application

Application React de chat en temps réel utilisant Socket.IO.

## Structure du code

```
src/
├── components/     # Composants React réutilisables
├── hooks/         # Hooks personnalisés (useSocket, useChat, etc.)
├── types/         # Types TypeScript
└── utils/         # Utilitaires et fonctions helpers
```

## Hooks principaux

### useSocket

Le hook principal pour la gestion des connexions Socket.IO. Il gère :

- La connexion au serveur
- L'envoi et la réception des messages
- La gestion des utilisateurs connectés
- Les indicateurs de frappe

```typescript
const {
  socket,
  initSocket,
  sendMessage,
  startTyping,
  stopTyping,
  connectedUsers,
  disconnect,
} = useSocket();
```

### useChat

Gère l'état du chat et les messages :

- Historique des messages
- Utilisateurs en train de taper
- Stockage local des messages

## Variables d'environnement

```env
# URL de l'API (obligatoire)
VITE_API_URL=http://localhost:3001
```

## Scripts disponibles

```bash
# Développement
pnpm dev

# Build
pnpm build

# Preview du build
pnpm preview
```

## Personnalisation

Le style peut être personnalisé via TailwindCSS dans le fichier `tailwind.config.js`.
