import express from 'express';
import { checkUserAuthenticated } from "../middlewares/auth.js";
import { ViewsController } from '../controllers/views.controller.js';

// Creamos un nuevo enrutador de express
export const router = express.Router();

// Creamos una ruta GET para '/' para mostrar el login
router.get("/", ViewsController.renderLogin);

// Creamos una ruta GET para '/registro' para mostrar el registro
router.get("/registro", ViewsController.renderSignup);

// Creamos una ruta GET para '/perfil' para mostrar el perfil del usuario
router.get("/perfil", ViewsController.renderProfile);

// Creamos una ruta GET para '/home' utilizando MongoDB
router.get('/home', checkUserAuthenticated, ViewsController.renderHome);

// Creamos una ruta GET para '/realtimeproducts'
router.get('/realtimeproducts', checkUserAuthenticated, ViewsController.renderRealTimeProducts);

// Creamos una ruta GET para '/chat'
router.get("/chat", checkUserAuthenticated, ViewsController.renderChat);

// Obtener el carrito de un usuario
router.get('/cart/:cid', checkUserAuthenticated, ViewsController.renderCart);

// Creamos una ruta GET para '/reset-password'
router.get('/forgot-password', ViewsController.renderForgot);

// Creamos una ruta GET para '/reset-password'
router.get('/reset-password', ViewsController.renderResetPassword);

