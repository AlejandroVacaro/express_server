import { productsDao } from '../dao/index.js';
import { addLogger } from '../utils/loggers.js';
import { UsersService } from '../services/users.service.js';
import { cartService } from '../dao/index.js';

const logger = addLogger();

export class ViewsController {

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
        res.render('profile', { user: JSON.parse(JSON.stringify(req.user)) });
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
            // Check if the user is an admin
            const isAdmin = req.user && req.user.role === 'admin';
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
                isAdmin: isAdmin,
                user: JSON.parse(JSON.stringify(req.user))
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

            if (!cart) {
                return res.render('cart', { error: 'Carrito no encontrado.' });
            }
            const detailedProducts = [];
            let totalCost = 0; // Initialize total cost

            for (let product of cart.products) {
                const productDetails = await productsDao.getProductById(product.productId);

                if (productDetails) {
                    const productTotal = productDetails.price * product.quantity;
                    totalCost += productTotal; // Add to total cost

                    detailedProducts.push({
                        ...productDetails._doc,
                        quantity: product.quantity,
                        total: productTotal // Optional: include total cost per product
                    });
                } else {
                    console.log('Detalles del producto no encontrados para el producto ID:', product.productId);
                }
            }

            const detailedCart = {
                _id: cart._id,
                products: detailedProducts,
                __v: cart.__v,
                totalCost: totalCost // Include total cost in the cart object
            };

            const plainCart = JSON.parse(JSON.stringify(detailedCart));
            console.log('Total cost:', totalCost);
            res.render('cart', { cart: detailedCart, totalCost: totalCost });
        } catch (error) {
            console.error('Error al obtener el carrito', error);
            res.render('errorPage', { error: 'Error al obtener el carrito.' });
        }
    };

    // Creamos controlador para renderizar la vista de recuperación de contraseña
    static renderForgot = (req, res) => {
        res.render('forgotPassword');
    };

    // Creamos controlador para renderizar la vista de reestablecer contraseña
    static renderResetPassword = (req, res) => {
        const token = req.query.token;
        res.render('resetPassword', { token });
    };

    // Método para renderizar la vista de Administración de usuarios
    static renderAdminUsers = async (req, res) => {
        if (req.user && req.user.role === 'admin') {
            try {
                const users = await UsersService.getAllUsers();
                res.render('adminUsers', { users: users });
            } catch (error) {
                res.status(500).send('Error al obtener los usuarios');
            }
        } else {
            res.redirect('/');
        }
    };
};