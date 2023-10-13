import mongoose from "mongoose";
import { cartsCollection} from "../../constants/index.js";

//Se crea un esquema para los carritos
const cartSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);
