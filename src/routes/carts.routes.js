// Importamos los módulos necesarios
import express from 'express';
import CartManager from '../dao/managers/fileSystem/cartManager.js';

// Inicializamos el enrutador de Express y el administrador de carritos de compra
const router = express.Router();
const cartManager = new CartManager('./carts.json');

// Definimos una ruta para obtener un carrito de compras específico por ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        // Intentamos obtener el carrito y lo enviamos en la respuesta
        const cart = await cartManager.getCartById(parseInt(cid));
        res.status(200).send(cart);
    } catch (error) {
        // En caso de error, lo registramos y enviamos un mensaje de error en la respuesta
        console.error('Error getting cart:', error);
        res.status(404).send('Cart not found');
    }
});

// Definimos una ruta para crear un nuevo carrito de compras
router.post('/', async (req, res) => {
    try {
        // Intentamos crear el carrito y enviamos el ID del nuevo carrito en la respuesta
        const newId = await cartManager.createCart();
        res.status(200).send(`Cart with id ${newId} created successfully.`);
    } catch (error) {
        // En caso de error, lo registramos y enviamos un mensaje de error en la respuesta
        console.error('Error creating cart:', error);
        res.status(500).send('Error creating cart');
    }
});

// Definimos una ruta para agregar un producto a un carrito de compras específico
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        // Intentamos agregar el producto al carrito y enviamos un mensaje de éxito en la respuesta
        await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.status(200).send(`Product with id ${pid} added to cart ${cid} successfully.`);
    } catch (error) {
        // En caso de error, lo registramos y enviamos un mensaje de error en la respuesta
        console.error('Error adding product to cart:', error);
        res.status(500).send('Error adding product to cart');
    }
});

// Exportamos el enrutador para usarlo en otros módulos
export default router;
