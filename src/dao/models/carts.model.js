import mongoose from "mongoose";
import { cartsCollection } from "../../constants/index.js";

const cartSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);