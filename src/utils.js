import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from './config/config.js';
import { addLogger } from './utils/loggers.js';

const logger = addLogger();

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
        logger.error('Error al validar el token', error.message);
        return null;
    }
};


// Función para validar los campos de un usuario
const checkValidFields = (body) => {
    const { first_name, last_name, email, password } = body;
    if (!first_name || !last_name || !email || !password) {
        return false;
    }
    return true;
};

// Filtro para validar los campos de un usuario
const multerProfileFilter = (req, file, cb) => {
    const valid = checkValidFields(req.body);
    if (valid) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Configuración de multer para guardar imágenes de perfil de usuario
const profileStorage = multer.diskStorage({
    // Establecemos el almacenamiento de la imagen de perfil
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/multer/users/profiles'));
    },
    // Establecemos el nombre de la imagen de perfil
    filename: (req, file, cb) => {
        cb(null, `${req.body.email}-perfil-${file.originalname}`);
    }
});

// Creamos uploader para la imagen de perfil
export const profileUploader = multer({ storage: profileStorage, fileFilter: multerProfileFilter });


// Configuración de multer para guardar imágenes de productos
const productStorage = multer.diskStorage({
    // Establecemos el almacenamiento de la imagen de producto
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/multer/products/img'));
    },
    // Establecemos el nombre de la imagen de producto
    filename: (req, file, cb) => {
        cb(null, `${req.body.code}-product-${file.originalname}`);
    }
});

// Creamos uploader para la imagen de producto
export const productUploader = multer({ storage: productStorage });


// Configuración de multer para guardar documentos de usuario
const documentsStorage = multer.diskStorage({
    // Establecemos el almacenamiento del documento
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/multer/users/documents'));
    },
    // Establecemos el nombre del documento
    filename: (req, file, cb) => {
        cb(null, `${req.user.email}-document-${file.originalname}`);
    }
});

// Creamos uploader para el documento
export const documentsUploader = multer({ storage: documentsStorage });



