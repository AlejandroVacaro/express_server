import { CartManagerMongo } from "../dao/managers/mongoDB/cartManagerMongo.js";
import { CustomError } from "../services/error/customError.service.js";
import { EError } from "../enums/EError.js";
import { invalidCartIdError } from "../services/error/addProductToCartError.service.js";

const cartManager = new CartManagerMongo();

export class CartsService {

    //Servicio para crear un carrito
    static cartCreate = async (cartInfo) => {
        return await cartManager.save(cartInfo);
    };

    //Servicio para obtener todos los carritos
    static getCarts = async () => {
        return await cartManager.getAll();
    };

    //Servicio para obtener un carrito por ID
    static async getCartById(cartId) {
        try {
            return await cartManager.getById(cartId);
        } catch (error) {
            if (error.message === "Cart not found") {
                throw CustomError.createError({
                    name: 'CartNotFound error',
                    cause: invalidCartIdError(cartId),
                    message: `El carrito con el ID ${cartId} no fue encontrado`,
                    errorCode: EError.INVALID_PARAM
                });
            }
            throw error;
        }
    };

    //Servicio para agregar productos al carrito
    static addToCart = async (products) => {
        return await cartManager.addProduct(products);
    };

    //Servicio para actualizar un carrito
    static updateCart = async (cartId, cartInfo) => {
        return await cartManager.update(cartId, cartInfo);
    };

    //Servicio para eliminar productos del carrito
    static deleteFromCart = async (cartId, productId) => {
        return await cartManager.removeProduct(cartId, productId);
    };

    //Servicio para eliminar un carrito
    static deleteCart = async (cartId) => {
        return await cartManager.deleteCart(cartId);
    };

    //Servicio para actualizar el carrito de un usuario con los productos rechazados
    static async updateUserCart(userId, rejectedProducts) {
        return await cartManager.updateUserCart(userId, rejectedProducts);
    };
};
