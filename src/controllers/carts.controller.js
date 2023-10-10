import { cartService } from "../dao/index.js";

export const CartsController = {

    // Creamos controlador para crear un nuevo carrito
    createCart: async (req, res) => {
        try {
            const cartCreated = await cartService.save();
            res.json({ status: "success", data: cartCreated });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    },

    // Creamos controlador para obtener un carrito específico por ID
    getCartById: async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await cartService.getById(cartId);
            res.json({ status: "success", data: cart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    },

    // Creamos controlador para añadir un producto a un carrito
    addProductToCart: async (req, res) => {
        try {
            const cartId = req.params.cid;
            const product = req.body.product;
            const updatedCart = await cartService.addProduct(cartId, product);
            res.json({ status: "success", data: updatedCart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    },

    // Creamos controlador para eliminar un producto de un carrito
    removeProductFromCart: async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await cartService.removeProduct(cartId, productId);
            res.json({ status: "success", data: updatedCart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    },

    // Creamos controlador para obtener todos los carritos
    getAllCarts: async (req, res) => {
        try {
            const carts = await cartService.getAll();
            res.json({ status: "success", data: carts });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    },

    // Creamos controlador para eliminar un carrito específico
    deleteCart: async (req, res) => {
        try {
            const cartId = req.params.cid;
            await cartService.delete(cartId);
            res.json({ status: "success", message: "Cart deleted successfully" });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }

};
