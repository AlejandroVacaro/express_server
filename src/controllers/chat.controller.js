import { chatService } from "../services/chat.service.js";
import { chatManagerMongo } from "../dao/managers/mongoDB/chatManagerMongo.js";

export const ChatController = {

    // Controlador para inicializar el servicio de chat
    initializeChat: (req, res) => {
        const httpServer = req.httpServer;
        const io = chatService.initializeChatService(httpServer);
        res.json({ status: "success", message: "Chat initialized successfully" });
    },

    // Controlador para enviar un mensaje
    sendMessage: async (req, res) => {
        try {
            const { sender, message } = req.body;
            await chatManagerMongo.createMessage(sender, message);
            res.json({ status: "success", message: "Message sent successfully" });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },

    // Controlador para obtener todos los mensajes
    getMessages: async (req, res) => {
        try {
            const messages = await chatManagerMongo.getMessages();
            res.json({ status: "success", data: messages });
        } catch (error) {
            res.status(500).json({ status: "error", message: error.message });
        }
    },

};

