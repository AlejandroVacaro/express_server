import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { checkUserAuthenticated, checkUserRole } from "../middlewares/auth.js";
import { TicketsController } from "../controllers/tickets.controller.js";

const router = Router();

//Ruta para crear un carrito, solo para usuarios con rol user o premium
router.post("/", checkUserAuthenticated, checkUserRole(['user', 'premium']), CartsController.createCart);

//Ruta para obtener un carrito por ID
router.get("/:cid", CartsController.getCartById);

//Ruta para agregar un producto a un carrito, solo para usuarios con rol user o premium
router.post("/:cid/products/:pid", checkUserAuthenticated, checkUserRole(['user', 'premium']), CartsController.addProductToCart);

//Ruta para eliminar un producto de un carrito, solo para usuarios con rol user o premium
router.delete("/:cid/products/:pid", checkUserAuthenticated, checkUserRole(['user', 'premium']), CartsController.removeProductFromCart);

//Ruta para obtener todos los carritos
router.get("/", CartsController.getAllCarts);

//Ruta para eliminar un carrito
router.delete("/:cid", CartsController.deleteCart);

// Ruta para comprar los productos del carrito
router.post("/:cid/purchase", TicketsController.createTicket);


export default router;