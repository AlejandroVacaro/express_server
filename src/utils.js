import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from './config/config.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Importamos el módulo 'path' de Node.js, el cual proporciona utilidades para trabajar con rutas de archivos y directorios.
// Importamos 'fileURLToPath' de 'url' que proporciona utilidades para manipulación de URLs.
// En este caso, 'fileURLToPath' se utiliza para convertir una URL en una ruta de archivo del sistema.
// Luego, estamos utilizando la función 'dirname' del módulo 'path' para obtener el nombre del directorio del archivo actual.
// 'fileURLToPath' se usa para convertir 'import.meta.url' (la URL del archivo actual) en una ruta de archivo del sistema.
// El resultado se exporta como '__dirname', que es una convención común en Node.js para representar la ruta del directorio del archivo actual.

// Función para crear un hash de una contraseña
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};


// Función para validar una contraseña
export const isValidPassword = (userDB, password) => {
    return bcrypt.compareSync(password, userDB.password);
};

// Función para validar un token
export const validateToken = (token) => {
    try {
        const info = jwt.verify(token, config.gmail.secretToken);
        return info.email;
    } catch (error) {
        console.log('Error al validar el token', error.message);
        return null;
    }
};



