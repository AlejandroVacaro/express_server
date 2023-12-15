import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['admin', 'user', 'premium']
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                }
            }

        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['pendiente', 'incompleto', 'completo'],
        default: 'pendiente'
    },
    avatar: {
        type: String,
        required: true
    }
});

export const usersModel = mongoose.model(userCollection, userSchema);
