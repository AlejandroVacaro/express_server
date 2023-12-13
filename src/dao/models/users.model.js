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
    }
});

export const usersModel = mongoose.model(userCollection, userSchema);
