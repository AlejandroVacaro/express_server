import { productsModel } from "../../models/products.model.js";
import { addLogger } from "../../../utils/loggers.js";

const logger = addLogger();

export class productsDaoMongo {
    constructor() {
        this.model = productsModel;
    }

    // Obtiene todos los productos de la base de datos
    async getProducts() {
        try {
            const products = await this.model.find().lean();
            return products;
        } catch (error) {
            logger.error(error.message);
            throw new Error('Hubo un error al obtener los productos');
        }
    };

    // Obtiene productos con paginación
    async getWithPaginate(query, options) {
        try {
            const products = await this.model.paginate(query, options);
            return products;
        } catch (error) {
            throw error;
        }
    };

    // Guardar un producto en la base de datos
    async addProduct(productInfo) {
        try {
            const productCreated = await this.model.create(productInfo);
            return productCreated;
        } catch (error) {
            logger.error(error.message);
            throw new Error('Hubo un error al guardar el producto');
        }
    };

    // Obtener un producto por id  
    async getProductById(id) {
        try {
            const product = await this.model.findById(id);
            return product;
        } catch (error) {
            logger.error(error.message);
            throw new Error('Hubo un error al obtener el producto');
        }
    };

    // Actualizar el stock de un producto
    async updateProductStock(productId, quantity) {
        try {
            const product = await this.model.findById(productId);
            if (product.stock < quantity) {
                throw new Error('No hay suficiente stock');
            }
            product.stock -= quantity;
            await product.save();
            return product;
        }
        catch (error) {
            logger.error(error.message);
            throw new Error(`Hubo un error al actualizar el stock del producto ${productId}`);
        }
    };
};
