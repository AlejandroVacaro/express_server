import { ProductsService } from "../services/products.service.js";

export class ProductsController {

    // Creamos controlador para obtener todos los productos o un número limitado de ellos
    static getProducts = async (req, res) => {
        try {
            const result = await ProductsService.getProducts();
            const limit = parseInt(req.query.limit);
            let products;
            if (limit > 0) {
                products = result.slice(0, limit);
            } else {
                products = result;
            }
            res.json({ status: 'success', data: products });
        } catch (error) {
            res.send({ status: 'error', message: error.message });
        }
    };

    // Creamos controlador para obtener un producto específico por ID
    static getProductById = async (req, res) => {
        try {
            const id = parseInt(req.params.pid);
            const product = await ProductsService.getProductById(id);

            if (!product) {
                return res.send({ error: 'Product does not exist' });
            }

            res.send(product);
        } catch (error) {
            res.send({ error: error.message });
        }
    };

    // Creamos controlador para añadir un nuevo producto
    static addProduct = async (req, res) => {
        try {
            // Se obtienen los datos del producto desde el body de la petición y se guarda en la BD
            const { title, description, price, code, stock, category, thumbnails } = req.body;
            const owner = req.user._id;
            const status = req.body.status !== undefined ? (req.body.status === 'true') : true;
            const isAdded = await ProductsService.addProduct({ title, description, price, code, stock, category, thumbnails, status, owner });

            if (isAdded) {
                res.send({ status: 'success', message: 'Product added successfully' });
            } else {
                res.status(400).send({ status: 'error', message: 'Failed to add product, code is repeated' });
            }
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'Invalid request' });
        }
    };

    // Creamos controlador para actualizar un producto específico
    static updateProduct = async (req, res) => {
        try {
            const id = parseInt(req.params.pid);
            const productUpdates = req.body;

            await ProductsService.updateProduct(id, productUpdates);
            res.send({ status: 'success', message: 'Product updated successfully' })

        } catch (error) {
            res.status(400).send({ status: 'error', error: 'Invalid request' });
        }
    };

    // Creamos controlador para eliminar un producto específico
    static deleteProduct = async (req, res) => {
        try {
            const id = parseInt(req.params.pid);
            const product = await ProductsService.getProductById(id);
            if (!product) {
                return res.status(404).send({ error: 'Product does not exist' });
            }
            await ProductsService.deleteProduct(id);
            res.send({ status: 'success', message: 'Product deleted successfully' })
        } catch (error) {
            res.status(400).send({ status: 'error', error: 'Invalid request' });
        }
    };
}