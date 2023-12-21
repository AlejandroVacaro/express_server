import { productsDao, usersDao } from '../dao/index.js';
import { sendEmail } from '../utils/gmail.js';

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

    // Servicio para actualizar el precio de un producto específico
    static updateProductPrice = async (id, price) => {
        try {
            const isUpdated = await productsDao.updateProductPrice(id, price);
            return isUpdated;
        } catch (error) {
            throw error;
        }
    };

    // Servicio para eliminar un producto específico
    static deleteProduct = async (id) => {
        try {
            // Recuperar el producto y su propietario
            const product = await productsDao.getProductById(id);
            const owner = await usersDao.getByID(product.owner);

            // Chequear si el propietario es premium
            const isPremiumUser = owner.isPremium || owner.role === 'premium';

            // Borramos el producto
            const isDeleted = await productsDao.deleteProduct(id);

            // Si el producto se borró y el propietario es premium, enviar un email de notificación
            if (isDeleted && isPremiumUser) {
                const subject = 'Notificación de producto eliminado';
                const message = `<p>El producto "${product.title}" ha sido eliminado.</p>`;
                await sendEmail(null, owner.email, subject, message);
            }

            return isDeleted;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    };
}