import UserDTO from "../dao/models/user.dto.js";
import express from "express";
import { UsersService } from "../services/users.service.js";
import { addLogger } from '../utils/loggers.js';
import { sendEmail } from "../utils/gmail.js";

const logger = addLogger();

const router = express.Router();


router.get('/current', (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

export class UserController {

    // Método para modificar el rol de un usuario
    static async modifyRole(req, res) {
        try {
            const userId = req.params.uid;
            // Verificamos que el usuario exista
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;

            // Cambiar de 'user' a 'premium'
            if (userRole === 'user') {
                if (user.status === 'completo' && user.documents.length >= 3) {
                    user.role = 'premium';
                    await UsersService.updateUser(user._id, user);
                    return res.json({ status: 'success', message: 'El rol del usuario ha sido modificado a premium con éxito' });
                } else {
                    return res.json({ status: 'error', message: 'El usuario no cumple con los requisitos para ser premium' });
                }
            }

            // Cambiar de 'premium' a 'user'
            if (userRole === 'premium') {
                user.role = 'user';
                await UsersService.updateUser(user._id, user);
                return res.json({ status: 'success', message: 'El rol del usuario ha sido modificado a user con éxito' });
            }

            // Si el usuario no es ni 'user' ni 'premium' (sería 'admin')
            return res.json({ status: 'error', message: 'No se puede cambiar el rol de este usuario' });

        } catch (error) {
            console.error('Error modifying user role:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    };


    // Método para cargar los documentos de un usuario
    static uploadDocuments = async (req, res) => {
        try {
            const userId = req.params.uid;
            // Verificamos que el usuario exista
            const user = await UsersService.getUserById(userId);
            const identificacion = req.files?.identificacion?.[0] || null;
            const domicilio = req.files?.domicilio?.[0] || null;
            const estadoDeCuenta = req.files?.estadoDeCuenta?.[0] || null;
            const docs = [];
            // Validación de los documentos
            if (identificacion) {
                docs.push({ type: 'identificacion', reference: identificacion.filename });
            };
            if (domicilio) {
                docs.push({ type: 'domicilio', reference: domicilio.filename });
            };
            if (estadoDeCuenta) {
                docs.push({ type: 'estadoDeCuenta', reference: estadoDeCuenta.filename });
            };
            user.documents = docs;
            // Controlar el estado de verificación del usuario
            if (docs.length === 3) {
                user.status = 'completo';
            } else {
                user.status = 'incompleto';
            };
            // Actualizamos el usuario en la base de datos
            const result = await UsersService.updateUser(user._id, user);
            res.json({ status: 'success', data: result, message: 'Documentos cargados con éxito' });
        } catch (error) {
            logger.error(error.message);
            res.json({ status: 'error', message: 'No se pudieron cargar los documentos' });
        }
    };

    // Método para obtener todos los usuarios
    static getAllUsers = async (req, res) => {
        try {
            const users = await UsersService.getAllUsers();
            const usersDTO = users.map(user => new UserDTO(user));
            res.json({ status: 'success', data: usersDTO });
        } catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    };

    static deleteInactiveUsers = async (req, res) => {
        try {
            const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2));
            const inactiveUsers = await UsersService.getInactiveUsers(twoDaysAgo);

            for (const user of inactiveUsers) {
                console.log(`Borrando usuario: ${user._id}`);

                // Borramos el usuario de la base de datos
                await UsersService.deleteUserById(user._id);

                // Enviamos un email informando la eliminación
                sendEmail(req, user.email, 'Cuenta eliminada por inactividad', 'Lamentamos informarle que su cuenta ha sido eliminada por inactividad mayor a 2 días.');

                console.log(`Usuario eliminado y email enviado a: ${user._id}`);
            };

            res.json({ status: 'success', message: 'Usuarios inactivos eliminados con éxito' });
        } catch (error) {
            console.error('Error deleting inactive users:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    // Método para eliminar un usuario
    static deleteUser = async (req, res) => {
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);

            if (!user) {
                return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
            }

            // Borramos el usuario de la base de datos
            await UsersService.deleteUserById(userId);

            // Enviamos un email informando la eliminación
            sendEmail(req, user.email, 'Cuenta eliminada', 'Lamentamos informarle que su cuenta ha sido eliminada.');

            res.json({ status: 'success', message: 'Usuario eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };
};


