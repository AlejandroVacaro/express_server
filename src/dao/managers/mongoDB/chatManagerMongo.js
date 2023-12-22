import { chatModel } from '../../models/chat.model.js';

export class chatManagerMongo {
    // Método para crear un mensaje en la base de datos
    static createMessage = async (user, message) => {
        const newMessage = new chatModel({ user, message, timestamp: new Date() });
        return await newMessage.save();
    }

    // Método para obtener todos los mensajes de la base de datos
    static getMessages = async () => {
        return await chatModel.find().sort({ timestamp: 1 });
    }
}

