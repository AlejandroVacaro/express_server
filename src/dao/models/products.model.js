import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
        unique: true,
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
    thumbnail: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

productsSchema.plugin(mongoosePaginate);

//Modelo de productos
export const productsModel = mongoose.model(productsCollection, productsSchema);

