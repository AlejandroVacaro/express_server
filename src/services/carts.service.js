import { CartManagerMongo } from "../dao/managers/mongoDB/cartManagerMongo.js";

export class CartsService {
    
    //Servicio para crear un carrito
    static cartCreated = async (cartInfo) => {
        return await CartManagerMongo.save(cartInfo);
    };

    //Servicio para obtener todos los carritos
    static getCarts = async () => {
        return await CartManagerMongo.getAll();
    };

    //Servicio para obtener un carrito por ID
    static getCartById = async (cartId) => {
        return await CartManagerMongo.getById(cartId);
    };

    //Servicio para agregar productos al carrito
    static addToCart = async (products) => {
        return await CartManagerMongo.addProduct(products);
    };

    //Servicio para actualizar un carrito
    static updateCart = async (cartId, cartInfo) => {
        return await CartManagerMongo.update(cartId, cartInfo);
    };

    //Servicio para eliminar productos del carrito
    static deleteFromCart = async (cartId, productId) => {
        return await CartManagerMongo.removeProduct(cartId, productId);
    };

    //Servicio para eliminar un carrito
    static deleteCart = async (cartId) => {
        return await CartManagerMongo.delete(cartId);
    };

    //Servicio para actualizar el carrito de un usuario con los productos rechazados
    static async updateUserCart(userId, rejectedProducts) {
        return await CartManagerMongo.updateUserCart(userId, rejectedProducts);
    };
};
