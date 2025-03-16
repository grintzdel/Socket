# Groupe : TALLARON, COQBLIN et OUDIN
url de prod : 
- [Front-end](https://socket.maoudin.com)
- [Back-end](https://socket-api.maoudin.com)

# Socket Chat Application

Une application de chat en temps réel utilisant Socket.IO, avec une architecture monorepo.

## Architecture

Le projet est structuré en monorepo grâce aux pnpm workspaces avec deux applications principales :

- [`apps/web`](apps/web/README.md) : Application frontend React
- [`apps/api`](apps/api/README.md) : Serveur backend Socket.IO

## Technologies

### Frontend

- React 19
- TypeScript
- Vite
- Socket.IO Client
- TailwindCSS

### Backend

- Node.js
- Express
- Socket.IO
- TypeScript

## Installation

1. Prérequis :

```bash
npm install -g pnpm@latest-10
```

## 2. Installation des dépendances :

Installer toutes les dépendances en une commande :
```bash
pnpm run install:all
```

Ou séparément :
```bash
# Installation des dépendances du frontend
cd apps/web
pnpm install
```
```bash
# Installation des dépendances du backend
cd ../api
pnpm install
```

## 3. Démarrage en développement :

À la racine du projet :

```bash
pnpm dev
```

## Documentation détaillée

- [Documentation Frontend](apps/web/README.md)
- [Documentation Backend](apps/api/README.md)

## Licence

MIT
