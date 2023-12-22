import { cartsModel } from "../../models/carts.model.js";

//Se crea un manager para los carritos
export class CartManagerMongo {
    constructor() {
        this.model = cartsModel;
    };

    //Método para obtener todos los carritos
    async getAll() {
        try {
            const carts = await this.model.find();
            return carts;
        } catch (error) {
            throw error;
        }
    };

    //Método para obtener un carrito por ID
    async getById(cartId) {
        const cart = await this.model.findById(cartId).populate('products');
        if (!cart) {
            throw new Error("Cart not found");
        }
        return cart;
    };

    //Método para crear un carrito
    async save(cart) {
        try {
            const cartCreated = await this.model.create(cart);
            return cartCreated;
        } catch (error) {
            throw error;
        }
    };

    //Método para agregar un producto al carrito
    async addProduct(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    };

    //Método para actualizar un carrito
    async update(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }

            // Find the product in the cart
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex === -1) {
                // If the product is not in the cart, add it
                cart.products.push({ productId: productId, quantity: 1 });
            } else {
                // If the product is already in the cart, increment its quantity
                cart.products[productIndex].quantity += 1;
            }

            // Save the updated cart
            const cartUpdated = await cart.save();
            return cartUpdated;
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }

    //Método para actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            // Encuentra el carrito por ID
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }

            // Busca el producto en el carrito y actualiza su cantidad
            const productIndex = cart.products.findIndex(p => p.toString() === productId);
            if (productIndex === -1) {
                // Si el producto no está en el carrito, agrégalo
                cart.products.push({ _id: productId, quantity });
            } else {
                // Si el producto ya está en el carrito, actualiza su cantidad
                cart.products[productIndex].quantity = quantity;
            }

            // Guarda los cambios en el carrito
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    };

    // Método para actualizar el carrito del usuario con solo los productos rechazados
    async updateUserCartWithRejectedProducts(cartId, rejectedProducts) {
        try {
            const cart = await this.getById(cartId);
            if (!cart) {
                throw new Error("Cart not found");
            }

            // Filtrar los productos del carrito para dejar solo los rechazados
            cart.products = cart.products.filter(product =>
                rejectedProducts.some(rejected => rejected._id.toString() === product.productId.toString())
            );

            // Guardar los cambios en la base de datos
            return await this.update(cartId, cart);
        } catch (error) {
            throw error;
        }
    };

    // Método para eliminar un carrito específico
    async deleteCart(cartId) {
        try {
            const result = await this.model.findByIdAndDelete(cartId);
            if (!result) {
                throw new Error('Cart not found');
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

};