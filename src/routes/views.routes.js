// Importamos el paquete express para manejar las rutas y las peticiones HTTP
import express from 'express';
// Importamos la clase ProductManager que nos permitirá gestionar los productos
import { ProductManager } from '../ProductManager.js';

// Creamos un nuevo enrutador de express
export const router = express.Router();

// Creamos una nueva instancia de ProductManager, pasando la ruta al archivo JSON donde se almacenarán los productos
const productManager = new ProductManager('./products.json');

// Creamos una ruta GET para '/home'
router.get('/home', async (req, res) => {
    try {
        // Obtenemos todos los productos
        const products = await productManager.getProducts();
        // Renderizamos la vista 'home', pasando los productos y el archivo de estilo
        res.render('home', { products, style: 'home.css' });
    } catch (error) {
        // Si hay un error, lo devolvemos en la respuesta
        res.send({ error: error.message });
    }
});

// Creamos una ruta GET para '/realtimeproducts'
router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtenemos todos los productos
        const products = await productManager.getProducts();
        // Renderizamos la vista 'realTimeProducts', pasando los productos y el archivo de estilo
        res.render('realTimeProducts', { products, style: 'realtimeproducts.css' });
    } catch (error) {
        // Si hay un error, lo devolvemos en la respuesta
        res.send({ error: error.message });
    }
});
