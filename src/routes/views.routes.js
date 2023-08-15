import express from 'express';
import { productService } from '../dao/index.js';
import { cartService } from '../dao/index.js';


// Creamos un nuevo enrutador de express
export const router = express.Router();

// Creamos una nueva instancia de ProductManager, pasando la ruta al archivo JSON donde se almacenarán los productos
// const productManager = new ProductManager('./products.json');

// Creamos una ruta GET para '/home' utilizando FileSystem
// router.get('/home', async (req, res) => {
//     try {
//         // Obtenemos todos los productos
//         const products = await productManager.getProducts();
//         // Renderizamos la vista 'home', pasando los productos y el archivo de estilo
//         res.render('home', { products, style: 'home.css' });
//     } catch (error) {
//         // Si hay un error, lo devolvemos en la respuesta
//         res.send({ error: error.message });
//     }
// });

// Creamos una ruta GET para '/home' utilizando MongoDB
router.get('/home', async (req, res) => {
    try {
        console.log(req.query);
        const { limit = 10, page = 1, stock, sort = 'asc' } = req.query;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        if (!['asc', 'desc'].includes(sort)) {
            return res.render('home', { error: 'El parámetro sort debe ser asc o desc' });
        }
        const sortValue = sort === 'asc' ? 1 : -1;
        let query = {};
        if (stockValue) {
            query = { stock: { $gte: stockValue } };
        }

        const result = await productService.getWithPaginate(query,
            {
                page,
                limit,
                sort: { price: sortValue },
                lean: true
            });
        console.log(result);
        const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`
        const resultProductsView = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            prevPage: result.prevPage,
            hasPrevPage: result.hasPrevPage,
            prevLink: result.hasPrevPage ? baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`) : null,
            nextPage: result.nextPage,
            hasNextPage: result.hasNextPage,
            nextLink: result.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.includes("?") ? baseUrl.concat(`&page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`) : null
        }
        console.log(resultProductsView);

        const userCartId = req.session.cartId;

        res.render('home', { ...resultProductsView, cartId: userCartId });
    } catch (error) {
        res.render('home', { error: 'No es posible visualizar los productos' });
    }
});


// Creamos una ruta GET para '/realtimeproducts'
router.get('/realtimeproducts', async (req, res) => {
    try {
        // Obtenemos todos los productos
        const products = await productManager.getProducts();
        // Renderizamos la vista 'realTimeProducts', pasando los productos y el archivo de estilo
        res.render('realTimeProducts', { products, style: 'realtimeproducts.css' });
    } catch (error) {
        // Si hay un error, lo devolvemos en la respuesta
        res.send({ error: error.message });
    }
});

// Creamos una ruta GET para '/chat'
router.get("/chat", (req, res) => {
    res.render("chat");
});



router.get('/cart/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getById(cartId).populate('products');
        res.render('cartView', { cart });
    } catch (error) {
        res.render('errorView', { error: 'Unable to fetch the cart.' });
    }
});
