import { tickestsDao } from '../dao/index.js'

//Se crea un servicio para los tickets
export class TicketsService {
    static async createTicket(ticketInfo) {
        return await tickestsDao.createTicket(ticketInfo);
    };
};
