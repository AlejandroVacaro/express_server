import { Router } from "express";
import { cartService } from "../dao/index.js";

const router = Router();

//Ruta para crear un carrito
router.post("/", async (req, res) => {
    try {
        const cartCreated = await cartService.save();
        res.json({ status: "success", data: cartCreated });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

//Ruta para obtener un carrito a partir de su id
router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartService.getById(cartId); // Esta función ahora ya incluye el .populate('products')
        res.json({ status: "success", data: cart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});


router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartService.addProduct(cartId, productId);
        res.json({ status: "success", data: updatedCart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartService.removeProduct(cartId, productId);
        res.json({ status: "success", data: cart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const updatedCart = await cartService.updateCart(cartId, products);
        res.json({ status: "success", data: updatedCart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
        res.json({ status: "success", data: updatedCart });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        await cartService.clearCart(cartId);
        res.json({ status: "success", message: "Cart cleared successfully" });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});



export default router;