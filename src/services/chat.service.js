import { Server } from "socket.io";
import { chatManagerMongo } from "../dao/managers/mongoDB/chatManagerMongo.js";
import { addLogger } from "../utils/loggers.js";

const logger = addLogger();

const initializeChatService = (httpServer) => {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        logger.info(`Cliente conectado: ${socket.id}`);

        socket.on("authenticated", async (msg) => {
            const messages = await chatManagerMongo.getMessages();
            socket.emit("messageHistory", messages);
            socket.broadcast.emit("newUser", msg);
        });

        socket.on("message", async (data) => {
            await chatManagerMongo.createMessage(data.sender, data.message);
            const messages = await chatManagerMongo.getMessages();
            io.emit("messageHistory", messages);
        });
    });

    return io;
};

export { initializeChatService };

