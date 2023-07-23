import express from 'express';
import { ProductManager } from '../ProductManager.js';

export const router = express.Router();
const productManager = new ProductManager('./products.json');

router.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products, style: 'home.css' });
    } catch (error) {
        res.send({ error: error.message });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products, style: 'realtimeproducts.css' });
    } catch (error) {
        res.send({ error: error.message });
    }
});

