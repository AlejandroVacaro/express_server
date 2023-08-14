import mongoose from "mongoose";
import { productsModel } from "../../models/products.model.js";

export class ProductsMongo {
    constructor() {
        this.model = productsModel;
    }

    // Obtiene todos los productos de la base de datos
    async getProducts() {
        try {
            const products = await this.model.find();
            return products;
        } catch (error) {
            console.log(error.message);
            throw new Error('Hubo un error al obtener los productos');
        }
    };

    // Guardar un producto en la base de datos
    async addProduct(productInfo) {
        try {
            const productCreated = await this.model.create(productInfo);
            return productCreated;
        } catch (error) {
            console.log(error.message);
            throw new Error('Hubo un error al guardar el producto');
        }
    }

    // Obtener un producto por id  
    async getProductById(id) {
        try {
            const product = await this.model.findById(id);
            return product;
        } catch (error) {
            console.log(error.message);
            throw new Error('Hubo un error al obtener el producto');
        }
    }
};
