import { chatService } from "../services/chat.service.js";

export const ChatController = {

    // Creamos controlador para inicializar el servicio de chat
    initializeChat: (req, res) => {
        const httpServer = req.httpServer;
        const io = chatService.initializeChatService(httpServer);
        res.json({ status: "success", message: "Chat initialized successfully" });
    },

};
