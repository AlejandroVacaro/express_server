import UserDTO from "../dao/models/user.dto.js";
import express from "express";
import { UsersService } from "../services/users.service.js";
import { Logger } from "winston";
import e from "express";

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
            // Validación del estado del usuario
            if (user.status === 'completo' && user.documents.length >= 3) {
                // Validación del rol actual del usuario y el rol que se quiere asignar
            if (userRole === 'user') {
                user.role = 'premium';
            } else if (userRole === 'premium') {
                user.role = 'user';
            } else {
                return res.json({ status: 'error', message: 'No se puede cambiar el rol de este usuario' });
            };
            // Actualizamos el usuario en la base de datos
            await UsersService.updateUser(user._id, user);
            res.json({ status: 'success', message: `El rol del usuario ha sido modificado a ${user.role} con éxito` });
            } else {
                res.json({ status: 'error', message: 'El usuario no ha completado su registro' });
            };
        } catch (error) {
            res.json({ status: 'error', message: error.message });
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
            loggers.error(error.message);
            res.json({ status: 'error', message: 'No se pudieron cargar los documentos' });
        }
    };
};


