import { Server } from "socket.io";
import { chatManagerMongo } from "../dao/managers/mongoDB/chatManagerMongo.js";

// Función para inicializar el servicio de chat con Socket.io
const initializeChatService = (httpServer) => {
  const io = new Server(httpServer);

  // Evento de conexión de un cliente al servidor
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Evento de envío de mensaje de bienvenida por un nuevo cliente conectado
    socket.on("authenticated", async (msg) => {
      const messages = await chatManagerMongo.getMessages();
      socket.emit("messageHistory", messages);
      socket.broadcast.emit("newUser", msg);
    });

    // Evento de envíos de mensajes de chat a todos los clientes conectados
    socket.on("message", async (data) => {
      await chatManagerMongo.createMessage(data.sender, data.message);
      const messages = await chatManagerMongo.getMessages();
      io.emit("messageHistory", messages);
    });
  });

  return io;
};

export { initializeChatService };
