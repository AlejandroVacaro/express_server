import mongoose from "mongoose";

const chatcollection = 'chatMessages';

//Esquema de mensajes del chat
const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true

    },
    message: {
        type: String,
        required: true
    }
});

//Modelo de los mensajes del chat
const chatModel = mongoose.model(chatcollection, messageSchema);

export { chatModel };