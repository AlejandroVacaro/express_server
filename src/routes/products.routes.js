// Importamos los módulos necesarios
import express from 'express';
import { ProductManager } from '../ProductManager.js';
import { socketServer } from '../app.js';

// Inicializamos el enrutador de Express y el administrador de productos
const router = express.Router();
const productManager = new ProductManager('./products.json');

// Ruta para obtener todos los productos o un número limitado de ellos
router.get('/', async (req, res) => {
    try {
        const result = await productManager.getProducts();
        const limit = parseInt(req.query.limit);
        let products;
        if (limit > 0) {
            products = result.slice(0, limit);
        } else {
            products = result;
        }
        res.send(products);
    } catch (error) {
        res.send({ error: error.message });
    }
});

// Ruta para obtener un producto específico por ID
router.get('/:pid', async (req, res) => {
    //...
});

// Ruta para añadir un nuevo producto
router.post('/', async (req, res) => {
    //...
});

// Ruta para actualizar un producto específico
router.put('/:pid', async (req, res) => {
    //...
});

// Ruta para eliminar un producto específico
router.delete('/:pid', async (req, res) => {
    //...
});

// Exportamos el enrutador para usarlo en otros módulos
export default router;
