import { productsDao } from '../dao/index.js';

export class ProductsService {

    // Creamos controlador para obtener todos los productos o un número limitado de ellos
    static getProducts = async () => {
        try {
            const result = await productsDao.getProducts();
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Creamos controlador para obtener un producto específico por ID
    static getProductById = async (id) => {
        try {
            const product = await productsDao.getProductById(id);
            return product;
        } catch (error) {
            throw error;
        }
    };

    // Creamos controlador para añadir un nuevo producto
    static addProduct = async (product) => {
        try {
            const isAdded = await productsDao.addProduct(product);
            return isAdded;
        } catch (error) {
            throw error;
        }
    };

    // Creamos controlador para actualizar un producto específico
    static updateProduct = async (id, product) => {
        try {
            const isUpdated = await productsDao.updateProduct(id, product);
            return isUpdated;
        } catch (error) {
            throw error;
        }
    };

    // Creamos controlador para eliminar un producto específico
    static deleteProduct = async (id) => {
        try {
            const isDeleted = await productsDao.deleteProduct(id);
            return isDeleted;
        } catch (error) {
            throw error;
        }
    };
}