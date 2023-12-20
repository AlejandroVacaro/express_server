import { usersModel } from "../../models/users.model.js";
import { addLogger } from '../../../utils/loggers.js';

const logger = addLogger();

// Clase para manejar los usuarios en la base de datos
export class UsersManagerMongo {
    constructor() {
        this.model = usersModel;
    };

    // Función para obtener todos los usuarios
    async getAll() {
        try {
            const users = await this.model.find().lean();
            return users;
        } catch (error) {
            throw error;
        }
    };

    // Función para guardar un nuevo usuario
    async save(user) {
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    };

    // Función para obtener un usuario por id
    async getByID(userId) {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            return user;
        } catch (error) {
            throw error;
        }
    };

    // Función para obtener un usuario por email
    async getByEmail(email) {
        try {
            const user = await this.model.findOne({ email: email });
            if (!user) {
                logger.error("Usuario no encontrado");
            }
            return user;
        } catch (error) {
            throw error;
        }
    };

    // Función para actualizar un usuario
    async update(userId, newUserInfo) {
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId, newUserInfo, { new: true });
            return userUpdated;
        } catch (error) {
            logger.error("Error al actualizar el usuario", error);
            throw error;
        }
    };

    // Función para obtener todos los usuarios inactivos en los últimos 2 días
    async getInactiveUsers(date) {
        try {
            return await this.model.find({ last_connection: { $lte: date } });
        } catch (error) {
            throw error;
        }
    };

    // Función para eliminar un usuario por id
    async delete(userId) {
        try {
            return this.model.findByIdAndDelete(userId);
        } catch (error) {
            throw error;
        }
    };
};