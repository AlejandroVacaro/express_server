// Función para generar errores estructurados y genéricos.

export class CustomError {
    static createError({ name, cause, message, errorCode=1 }) {
        console.log('Valores: ', name, cause, message, errorCode);
        const error = new Error(message, { cause });
        error.name = name;
        error.code = errorCode;
        console.log('Error generado: ', error.cause);
        throw error;
    };
};

