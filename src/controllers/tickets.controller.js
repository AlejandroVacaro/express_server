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
                    throw new Error(`No hay suficiente stock del producto ${product.name}`);
                } else {
                    purchaseProducts.push(product);
                };
            };
            const newTicket = {
                code,
                purchase_datetime: new Date(),
                amount,
                purchaser: req.user._id,
            };
            const createdTicket = TicketsService.createTicket(ticketInfo);
        } catch (error) {
            res.json({status: 'error', message: error.message});
        };
    };

};

