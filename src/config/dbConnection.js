import mongoose from "mongoose";
import { config } from "./config.js";
import { addLogger } from "../utils/logger.js";

const logger = addLogger();

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo.url);
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error(`Error connecting to the database: ${error.message}`);
    }
};