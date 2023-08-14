import mongoose from "mongoose";

//Nombre de la colección de productos
const productsCollection = 'products';

//Esquema de productos
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Bebidas', 'Higiene', 'Frutas y verduras', 'Panadería', 'Comestibles']
    },
    thumbnails: {
        type: String
    },
    status: {
        type: String
    }
})

//Modelo de productos
export const productsModel = mongoose.model(productsCollection, productsSchema);

