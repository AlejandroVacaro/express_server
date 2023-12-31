import { tickestsDao } from '../dao/index.js';
import { addLogger } from '../utils/loggers.js';

const logger = addLogger();

export class TicketsService {
    static async createTicket(ticketInfo) {
        return await tickestsDao.createTicket(ticketInfo);
    };

    // Método para crear un ticket con los productos comprados
    static async createPurchaseTicket(purchasedProducts, userId) {
        try {
            const ticket = {
                userId: userId,
                products: purchasedProducts,
                date: new Date()
            };
            return await this.createTicket(ticket);
        } catch (error) {
            logger.error("Error creating ticket:", error);
            throw new Error('Error al crear el ticket');
        }
    };
};
