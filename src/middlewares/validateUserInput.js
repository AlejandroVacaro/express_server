import { CustomError } from "../services/error/customError.service.js";
import { EError } from "../enums/EError.js";
import { createUserErrorMsg } from "../services/error/createUserError.service.js";

// Función para validar que el usuario haya ingresado todos los datos necesarios para crear un usuario.
export const validateUserInput = (req, res, next) => {
    const { first_name, last_name, email } = req.body;
    console.log('req.body: ', req.body);
    if (!first_name || !last_name || !email) {
        CustomError.createError({
            name: "error createUser",
            cause: createUserErrorMsg(req.body), 
            message: "Datos invalidos para crear el usuario",
            errorCode: EError.INVALID_JSON
        });
        return res.status(400).send('Invalid input');
    }
    next();
};
