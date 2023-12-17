import {ticketsModel} from '../../models/tickets.model.js';
import { addLogger } from '../../../utils/loggers.js';

const logger = addLogger();

//Se crea un manager para los tickets
export class TicketsMongo {
    constructor() {
        this.model = ticketsModel;
    };

    async createTicket(ticketInfo) {
        try {
            const result = await this.model.create(ticketInfo);
            return result;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    };
};




