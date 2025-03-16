import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./handlers";

const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

// Log de démarrage du serveur
console.log("Démarrage du serveur Socket.IO...");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Socket API" });
});

io.on("connection", (socket) => {
  console.log(`Nouvelle connexion socket: ${socket.id}`);

  // Déléguer la gestion des événements aux gestionnaires
  setupSocketHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
