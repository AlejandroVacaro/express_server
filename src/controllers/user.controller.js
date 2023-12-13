import UserDTO from "../dao/models/user.dto.js";
import express from "express";
import { UsersService } from "../services/users.service.js";

const router = express.Router();


router.get('/current', (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

export class UserController {
    static async modifyRole(req, res) {
        try {
            const userId = req.params.uid;
            // Verificamos que el usuario exista
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;
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
            res.json({ status: 'success', message: `El rol del usuario ha sido modificado a ${user.role} con éxito`});
        } catch (error) {
            res.json({ status: 'error', message: error.message });
        }
    }
};
