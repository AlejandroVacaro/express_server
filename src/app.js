import express from "express";
import { ProductManager } from "./ProductManager.js"

const productManager = new ProductManager('./products.json');
const port = 8080;
const products = 0;
const app = express();

app.listen(port, () => console.log(`Server started on port ${port}`));

app.get('/products', async (req, res) => {
    try {
        const result = await productManager.getProducts();
        const limit = parseInt(req.query.limit);
        if (limit > 0) {
            products = result.filter(product => product.id <= limit)
        } else {
            products = result;
        }
        res.send(products);
    } catch (error) {
        res.send(error.message)
    }
});

app.get('/products/:pid', async (req, res) => {
    try {
        const id = parseInt(req.query.id);
        const result = await productManager.getProductById(id);
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
});



