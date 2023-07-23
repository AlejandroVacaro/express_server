import express from 'express';
import { ProductManager } from '../ProductManager.js';
import { socketServer } from '../app.js';

const router = express.Router();
const productManager = new ProductManager('./products.json');


//recibe un limit por request y devuelve por response tantos productos como lo indique el limit, en caso de no tener limit, se devolverán todos los productos existentes
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

//recibe el id de un producto por request y en caso de existir lo envía por response, si no existiera muetra un objeto con mensaje de error
router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);

        if (!product) {
            return res.send({ error: 'Product does not exist' });
        }

        res.send(product);
    } catch (error) {
        res.send({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, code, stock, category, thumbnails } = req.body;
        const status = (req.body.status === 'true');
        const isAdded = await productManager.addProduct(title, description, price, code, stock, category, thumbnails, status);

        if (isAdded) {
            res.send({ status: 'success', message: 'Product added successfully' });
            const updatedProducts = await productManager.getProducts();
            socketServer.emit('productAdded', updatedProducts);
        } else {
            res.status(400).send({ status: 'error', message: 'Failed to add product, code is repeated' });
        }
    } catch (error) {
        res.status(400).send({ status: 'error', error: 'Invalid request' });
    }
});

router.put('/:pid', async (req, res) => {
    try {

        const id = parseInt(req.params.pid);
        const productUpdates = req.body;

        await productManager.updateProduct(id, productUpdates);
        res.send({ status: 'success', message: 'Product updated successfully' })

    } catch (error) {
        res.status(400).send({ status: 'error', error: 'Invalid request' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {

        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.status(404).send({ error: 'Product does not exist' });
        }
        await productManager.deleteProduct(id);
        const updatedProducts = await productManager.getProducts();
        socketServer.emit('productDeleted', { status: 'success', message: 'Product deleted successfully', updatedProducts });
        res.send({ status: 'success', message: 'Product deleted successfully' })
    } catch (error) {
        res.status(400).send({ status: 'error', error: 'Invalid request' });
    }
})



export default router;
