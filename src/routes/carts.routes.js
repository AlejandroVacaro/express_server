import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { checkUserAuthenticated, checkUserRole } from "../middlewares/auth.js";

const router = Router();

//Ruta para crear un carrito, solo para usuarios con rol user
router.post("/", checkUserAuthenticated, checkUserRole(['user']), CartsController.createCart);

//Ruta para obtener un carrito por ID
router.get("/:cid", CartsController.getCartById);

//Ruta para agregar un producto a un carrito, solo para usuarios con rol user
router.post("/:cid/products", checkUserAuthenticated, checkUserRole(['user']), CartsController.addProductToCart);

//Ruta para eliminar un producto de un carrito, solo para usuarios con rol user
router.delete("/:cid/products/:pid", checkUserAuthenticated, checkUserRole(['user']), CartsController.removeProductFromCart);

//Ruta para obtener todos los carritos
router.get("/", CartsController.getAllCarts);

//Ruta para eliminar un carrito
router.delete("/:cid", CartsController.deleteCart);

export default router;