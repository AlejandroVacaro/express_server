import mongoose from "mongoose";
import { config } from "../config/config.js";
import { productsModel } from "../dao/models/products.model.js";


const updateProducts = async()=>{
    try {
        await mongoose.connect(config.mongo.url);
        console.log("base de datos conectada");
        const adminId= "651f7435e568328697780377";
        const result = await productsModel.updateMany({},{$set:{owner:adminId}});
        console.log(result);
    } catch (error) {
        console.log(error);
    } finally{
        await mongoose.connection.close();
    }
};

updateProducts();