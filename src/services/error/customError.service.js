import { addLogger } from "../../utils/loggers";

const logger = addLogger();

// Función para generar errores estructurados y genéricos.
export class CustomError {
    static createError({ name, cause, message, errorCode=1 }) {
        logger.info('Valores: ', name, cause, message, errorCode);
        const error = new Error(message, { cause });
        error.name = name;
        error.code = errorCode;
        logger.error('Error generado: ', error.cause);
        throw error;
    };
};

