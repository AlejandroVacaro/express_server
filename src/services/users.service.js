import { usersDao } from '../dao/index.js';

export class UsersService {

    // Servicio para obtener todos los usuarios por email/username
    static getUserByEmail = async (username) => {
        return await usersDao.getByEmail(username);
    };

    // Servicio para guardar un nuevo usuario
    static saveUser = async (newUser) => {
        return await usersDao.save(newUser);
    };

    // Servicio para obtener un usuario por id
    static getUserById = async (id) => {
        return await usersDao.getByID(id);
    };

    // Servicio para actualizar un usuario
    static updateUser = async (userId, userInfo) => {
        return await usersDao.update(userId, userInfo);
    };
}