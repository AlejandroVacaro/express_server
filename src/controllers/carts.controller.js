import { CartsService } from '../services/carts.service.js';
import { ProductsService } from '../services/products.service.js';

export class CartsController {

    // Creamos controlador para crear un nuevo carrito
    static createCart = async (req, res) => {
        try {
            const newCart = req.body;
            const cartCreated = await CartsService.cartCreate(newCart);
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

    // Controlador para añadir un producto a un carrito
    static addProductToCart = async (req, res, next) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const userId = req.user._id;

        // Verificar si cartId y productId son válidos
        if (!cartId || cartId.length !== 24 || !productId || productId.length !== 24) {
            return res.status(400).json({ error: 'ID de carrito o producto no válido' });
        }

        try {
            const product = await ProductsService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Verificar si el usuario es el propietario del producto y tiene rol premium
            if (req.user.role === 'premium' && product.owner.toString() === userId.toString()) {
                return res.status(403).json({ error: 'No puedes agregar tu propio producto al carrito' });
            }

            const cart = await CartsService.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            // Agregar el producto al carrito
            const updatedCart = await CartsService.updateCart(cartId, productId);
            res.json({ status: 'success', data: updatedCart });
        } catch (error) {
            console.error('Error adding product to cart:', error);
            next(error);
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

