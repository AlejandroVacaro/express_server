import fs from 'fs';

class CartManager {
    constructor(file) {
        this.file = file;
    }

    async createCart() {
        let carts = await this.getCarts();

        let newId = 1;

        if (carts.length > 0) {
            let maxExistingId = Math.max(...carts.map(cart => cart.id));
            newId = maxExistingId + 1;
        }

        const newCart = {
            id: newId,
            products: []
        };

        carts.push(newCart);
        await this.saveCarts(carts);

        return newId;
    }

    async getCarts() {
        try {
            const carts = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(carts);
        } catch (error) {
            console.error('Error reading carts file', error);
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);

        if (!cart) {
            throw new Error('Cart not found');
        }

        return cart;
    }

    async saveCarts(carts) {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error('Error writing to carts file', error);
        }
    }

    async addProductToCart(cartId, productId) {
        let carts = await this.getCarts();
        let cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            console.error('Cart not found');
            return;
        }

        let product = cart.products.find(product => product.id === productId);

        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        await this.saveCarts(carts);
    }
}

export default CartManager;