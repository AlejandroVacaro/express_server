import { productsDao } from '../dao/index.js';

export class ProductsService {

    // Servicio para obtener todos los productos o un número limitado de ellos
    static getProducts = async () => {
        try {
            const result = await productsDao.getProducts();
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Servicio para obtener un producto específico por ID
    static getProductById = async (productId) => {
        try {
            const product = await productsDao.getProductById(productId);
            return product;
        } catch (error) {
            throw error;
        }
    };

    // Servicio para añadir un nuevo producto
    static addProduct = async (product) => {
        try {
            const isAdded = await productsDao.addProduct(product);
            return isAdded;
        } catch (error) {
            throw error;
        }
    };

    // Servicio para actualizar un producto específico
    static updateProductStock = async (id, quantity) => {
        try {
            const isUpdated = await productsDao.updateProductStock(id, quantity);
            return isUpdated;
        } catch (error) {
            throw error;
        }
    };

    // Servicio para eliminar un producto específico
    static deleteProduct = async (id) => {
        try {
            const isDeleted = await productsDao.deleteProduct(id);
            return isDeleted;
        } catch (error) {
            throw error;
        }
    };
}