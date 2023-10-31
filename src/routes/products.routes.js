import express from 'express';
import { ProductsController } from '../controllers/products.controller.js';
import { checkUserRole, checkUserAuthenticated } from '../middlewares/auth.js';
import { createProductError } from '../services/error/createProductError.service.js';
import { CustomError } from '../services/error/customError.service.js';
import { EError } from '../enums/EError.js';

// Inicializamos el enrutador de Express y el administrador de productos
const router = express.Router();

// Ruta para obtener todos los productos o un número limitado de ellos
router.get('/', ProductsController.getProducts);

// Ruta para obtener un producto específico por ID
router.get('/:pid', ProductsController.getProductById);

// Validamos los campos del producto
const validateFields = (req, res, next) => {
    const productInfo = req.body;
    // Verificamos que los campos no estén vacíos
    if (!productInfo.title || !productInfo.description || !productInfo.price || !productInfo.code || !productInfo.stock || !productInfo.category) {
        const error = CustomError.createError({
            name: 'validateFields error',
            cause: createProductError(productInfo),
            message: 'Parámetros inválidos para crear el producto',
            errorCode: EError.INVALID_PARAM
        });
        return next(error);
    } else {
        next();
    }
};
// Ruta para añadir un nuevo producto, solo para usuarios con rol admin
router.post('/', checkUserAuthenticated, checkUserRole(['admin']), validateFields, ProductsController.addProduct);

// Ruta para actualizar un producto específico, solo para usuarios con rol admin
router.put('/:pid', checkUserAuthenticated, checkUserRole(['admin']), ProductsController.updateProduct);

// Ruta para eliminar un producto específico, solo para usuarios con rol admin
router.delete('/:pid', checkUserAuthenticated, checkUserRole(['admin']), ProductsController.deleteProduct);

// Exportamos el enrutador para usarlo en otros módulos
export default router;
