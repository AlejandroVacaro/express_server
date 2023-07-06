import express from 'express';
import { ProductManager } from './ProductManager.js'

const productManager = new ProductManager('./products.json');
const app = express();
const port = 8080;

//se levanta el servidor local 8080
app.listen(port, () => console.log(`Server started on port ${port}`));

//recibe un limit por request y devuelve por response tantos productos como lo indique el limit, en caso de no tener limit, se devolverán todos los productos existentes
app.get('/products', async (req, res) => {
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
app.get('/products/:pid', async (req, res) => {
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
