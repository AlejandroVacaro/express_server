import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { __dirname } from "../utils.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación API de ecommerce",
            version: "1.0.0",
            description: "Definición de endpoints para la gestión de usuarios",
        },
    },
    // Archivos que contienen la documentación de los endpoints
    apis: [`${path.join(__dirname, "/docs/**/*.yaml")}}`],
};

// Genera una instancia de Swagger para la documentación de la API
export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
