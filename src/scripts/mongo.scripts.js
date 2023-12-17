import mongoose from "mongoose";
import { config } from "../config/config.js";
import { productsModel } from "../dao/models/products.model.js";
import { addLogger } from './utils/loggers.js';

const logger = addLogger();


const updateProducts = async () => {
    try {
        await mongoose.connect(config.mongo.url);
        logger.errorlog("base de datos conectada");
        const adminId = "651f7435e568328697780377";
        const result = await productsModel.updateMany({}, { $set: { owner: adminId } });
        logger.errorlog(result);
    } catch (error) {
        logger.errorlog(error);
    } finally {
        await mongoose.connection.close();
    }
};

updateProducts();