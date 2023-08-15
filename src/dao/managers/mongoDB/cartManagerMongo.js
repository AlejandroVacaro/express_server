import { cartsModel } from "../../models/carts.model.js";

export class CartManagerMongo {
    constructor() {
        this.model = cartsModel;
    };

    async getAll() {
        try {
            const carts = await this.model.find();
            return carts;
        } catch (error) {
            throw error;
        }
    };

    async getById(cartId) {
        try {
            const cart = await this.model.findById(cartId);
            return cart;
        } catch (error) {
            throw error;
        }
    };

    async save() {
        try {
            const cartCreated = await this.model.create({});
            return cartCreated;
        } catch (error) {
            throw error;
        }
    };

    async addProduct(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            cart.products.push(productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    };

    async update() {
        try {
            const cartUpdated = await this.model.updateOne();
            return cartUpdated;
        } catch (error) {
            throw error;
        }
    };
};