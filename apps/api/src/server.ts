import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./handlers";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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

server.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
