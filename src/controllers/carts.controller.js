import { CartsService } from '../services/carts.service.js';
import { ProductsService } from '../services/products.service.js';

export class CartsController {

    // Creamos controlador para crear un nuevo carrito
    static createCart = async (req, res) => {
        try {
            const newCart = req.body;
            const cartCreated = await CartsService.save(newCart);
            res.json({ status: "success", data: cartCreated });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

    // Creamos controlador para obtener un carrito específico por ID
    static getCartById = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await CartsService.getCartById(cartId);
            res.json({ status: "success", data: cart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

    // Creamos controlador para añadir un producto a un carrito
    static addProductToCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await CartsService.getCartById(cartId);
            const product = await ProductsService.getProductById(productId);
            const productExists = updatedCart.products.find(p => p.productId.toString() === productId.toString());
            if (productExists) {
                productExists.quantity += 1;
            } else {
                updatedCart.products.push({ productId, quantity: 1 });
            }
            res.json({ status: "success", data: updatedCart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

    // Creamos controlador para eliminar un producto de un carrito
    static removeProductFromCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await CartsService.deleteFromCart(cartId, productId);
            res.json({ status: "success", data: updatedCart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

    // Creamos controlador para obtener todos los carritos
    static getAllCarts = async (req, res) => {
        try {
            const carts = await CartsService.getAll();
            res.json({ status: "success", data: carts });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

    // Creamos controlador para eliminar un carrito específico
    static deleteCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            await CartsService.deleteCart(cartId);
            res.json({ status: "success", message: "Cart deleted successfully" });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    };

};


