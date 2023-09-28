import mongoose from 'mongoose';

// Definición del Esquema de Chat
const ChatSchema = new mongoose.Schema({
    sender: String,
    message: String,
    timestamp: Date,
});

const ChatModel = mongoose.model('Chat', ChatSchema);

export class chatManagerMongo {
    // Método para crear un mensaje en la base de datos
    static createMessage = async (sender, message) => {
        const newMessage = new ChatModel({ sender, message, timestamp: new Date() });
        return await newMessage.save();
    }

    // Método para obtener todos los mensajes de la base de datos
    static getMessages = async () => {
        return await ChatModel.find().sort({ timestamp: 1 });
    }
}

