import { usersDao } from '../dao/index.js';

export class UsersService {

    static getUserByEmail = async (username) => {
        return await usersDao.getByEmail(username);
    };

    static saveUser = async (newUser) => {
        return await usersDao.save(newUser);
    };

    static getUserById = async (id) => {
        return await usersDao.getByID(id);
    };
}