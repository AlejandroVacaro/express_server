import express from 'express';
import { ProductsController } from '../controllers/products.controller.js';

// Inicializamos el enrutador de Express y el administrador de productos
const router = express.Router();

// Ruta para obtener todos los productos o un número limitado de ellos
router.get('/', ProductsController.getProducts);

// Ruta para obtener un producto específico por ID
router.get('/:pid', ProductsController.getProductById);

// Ruta para añadir un nuevo producto
// Validamos que los campos del producto no estén vacíos
const validateFields = (req, res, next) => {
    const productInfo = req.body;
    if (!productInfo.title || !productInfo.description || !productInfo.price || !productInfo.code || !productInfo.stock || !productInfo.category) {
        return res.json({ status: 'error', message: 'Campos incompletos' });
    } else {
        next();
    }
};
router.post('/', validateFields, ProductsController.addProduct);

// Ruta para actualizar un producto específico
router.put('/:pid', ProductsController.updateProduct);

// Ruta para eliminar un producto específico
router.delete('/:pid', ProductsController.deleteProduct);

// Exportamos el enrutador para usarlo en otros módulos
export default router;
