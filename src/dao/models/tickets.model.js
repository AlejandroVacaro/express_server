import mongoose from 'mongoose';

//Se define el modelo de los tickets
const ticketsCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    purchase_datetime: Date,
    amount: {
        type: Number,
        required: true,
    },
    purchaser: String,
});

export const ticketsModel = mongoose.model(ticketsCollection, ticketSchema);