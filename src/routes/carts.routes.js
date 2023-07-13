import express from 'express';
import CartManager from '../CartManager.js';

const router = express.Router();
const cartManager = new CartManager('./carts.json');

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(parseInt(cid));
        res.status(200).send(cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(404).send('Cart not found');
    }
});

router.post('/', async (req, res) => {
    try {
        const newId = await cartManager.createCart();
        res.status(200).send(`Cart with id ${newId} created successfully.`);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).send('Error creating cart');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.status(200).send(`Product with id ${pid} added to cart ${cid} successfully.`);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send('Error adding product to cart');
    }
});



export default router;