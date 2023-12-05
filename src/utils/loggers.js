import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// Consulta de entorno actual de la aplicación
const currentEnv = process.env.NODE_ENV;

// Definición de niveles personalizados
const customLevels = {
    levels: {
      debug: 5,
      http: 4,
      info: 3,
      warning: 2,
      error: 1,
      fatal: 0
    }
  };
  

// Se crean los transportes (sistemas de almacenamiento) de logs:

// Transporte para entorno de desarrollo
const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ level: 'debug'})
    ]
});

// Transporte para entorno de producción
const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        // Mostrar mensajes de nivel info y superiores en la consola
        new winston.transports.Console({ level: 'info' }),
        // Almacenar mensajes de nivel error y superiores en un archivo
        new winston.transports.File({ filename: './logs/errors.log', level: 'error' })
    ]
});

// Definir el logger a utilizar según el entorno
export const addLogger = () => {
    let logger;
    if (currentEnv === 'development') {
        logger = devLogger;
    } else {
        logger = prodLogger;
    }
    return logger;
};
