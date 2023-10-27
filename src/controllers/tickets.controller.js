import { TicketsService } from "../services/tickets.service.js";
import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";

export class TicketsController {

    static async createTicket(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await CartsService.getCartById(cartId);
            const productsCart = cart.products;
            let purchaseProducts = [];
            let rejectedProducts = [];

            for (let i = 0; i < productsCart.length; i++) {
                const product = await ProductsService.getProductById(productsCart[i].productId);
                if (product.stock < productsCart[i].quantity) {
                    rejectedProducts.push(product);
                } else {
                    purchaseProducts.push(product);
                    // Actualizar el stock del producto
                    await ProductsService.updateProductStock(product._id, productsCart[i].quantity);
                }
            };

            // Crear el ticket con los productos comprados
            const ticketInfo = {
                userId: req.user._id,
                products: purchaseProducts,
                date: new Date()
            };
            await TicketsService.createPurchaseTicket(ticketInfo);

            // Si hay productos rechazados, devolverlos en la respuesta
            if (rejectedProducts.length > 0) {
                res.json({
                    status: 'error',
                    message: 'Algunos productos no pudieron ser comprados debido a la falta de stock.',
                    rejectedProducts: rejectedProducts.map(product => product._id)
                });
            } else {
                res.json({
                    status: 'success',
                    message: 'Compra realizada con éxito.'
                });
            };

            // Actualizar el carrito del usuario para contener solo los productos rechazados
            await CartsService.updateUserCart(req.user._id, rejectedProducts);

        } catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
}

