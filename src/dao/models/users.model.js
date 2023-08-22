import mongoose from "mongoose";

const userCollection = "users";

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    password: { type: String, required: true },
    role: {
        type: String,
        default: 'usuario',
        enum: ['admin', 'usuario']
    }
});

export const usersModel = mongoose.model(userCollection, UserSchema);
