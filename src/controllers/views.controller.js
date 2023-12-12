import { productsDao } from '../dao/index.js';

export class ViewsController{

    // Creamos controlador para renderizar la vista de login
    static renderLogin = (req, res) => {
        res.render('login');
    };

    // Creamos controlador para renderizar la vista de registro
    static renderSignup = (req, res) => {
        res.render('signup');
    };

    // Creamos controlador para renderizar la vista de perfil
    static renderProfile = (req, res) => {
        res.render('profile', { user : JSON.parse(JSON.stringify(req.user)) });
    };  

    // Creamos controlador para renderizar la vista de home
    static renderHome = async (req, res) => {
        try {
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

            const result = await productsDao.getWithPaginate(query,
                {
                    page,
                    limit,
                    sort: { price: sortValue },
                    lean: true
                });
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
                nextLink: result.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) : baseUrl.includes("?") ? baseUrl.concat(`&page=${result.nextPage}`) : baseUrl.concat(`?page=${result.nextPage}`) : null,
                user: JSON.parse(JSON.stringify(req.user)) // Esto es para que el usuario se pueda ver en la vista
            }
            //const userCartId = req.session.cartId;
            res.render('home', resultProductsView);
        } catch (error) {
            res.render('home', { error: 'No es posible visualizar los productos' });
        }
    };

    // Creamos controlador para renderizar la vista de productos en tiempo real
    static renderRealTimeProducts = async (req, res) => {
        try {
            // Obtenemos todos los productos
            const products = await productsDao.getProducts();
            // Renderizamos la vista 'realTimeProducts', pasando los productos y el archivo de estilo
            res.render('realTimeProducts', { products, style: 'realtimeproducts.css' });
        } catch (error) {
            // Si hay un error, lo devolvemos en la respuesta
            res.send({ error: error.message });
        }
    };

    // Creamos controlador para renderizar la vista de chat
    static renderChat = (req, res) => {
        res.render('chat');
    };

    // Creamos controlador para renderizar la vista de carrito
    static renderCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await cartService.getById(cartId);
            const detailedProducts = [];
            for (let product of cart.products) {
                const productDetails = await productsDao.getProductById(product._id);
                detailedProducts.push({
                    ...productDetails._doc, // _doc te da el objeto subyacente del documento Mongoose
                    quantity: product.quantity
                });
            }

            // Crear un objeto de carrito con detalles completos de los productos
            const detailedCart = {
                _id: cart._id,
                products: detailedProducts,
                __v: cart.__v
            };

            const plainCart = JSON.parse(JSON.stringify(detailedCart));
            res.render('cart', { cart: plainCart });
        } catch (error) {
            console.error('Error al obtener el carrito', error);
        };
    };

    // Creamos controlador para renderizar la vista de recuperación de contraseña
    static renderForgot = (req, res) => {
        res.render('forgotPassword');
    };

    // Creamos controlador para renderizar la vista de reestablecer contraseña
    static renderResetPassword = (req, res) => {
        const token = req.params.token;
        res.render('resetPassword', { token });
    };

};

