import { usersModel } from "../../models/users.model.js";

// Clase para manejar los usuarios en la base de datos
export class UsersManagerMongo {
    constructor() {
        this.model = usersModel;
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
            const user = await this.model.findOne({ email:email });
            if (!user) {
                console.error("Usuario no encontrado");
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
            console.error("Error al actualizar el usuario", error);
            throw error;
        }
    }
};