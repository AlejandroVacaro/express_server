// Función para generar errores personalizados para los usuarios.

export const createUserErrorMsg = (user)=> {
    return `
        Uno o más campos son inválidos.
        Listado de campos requeridos:
        - Nombre: Este campo es obligatorio y de tipo string, el dato recibido fue ${user.first_name}
        - Apellido: Este campo es obligatorio y de tipo string, el dato recibido fue ${user.last_name}
        - Email: Este campo es obligatorio y de tipo string, el dato recibido fue ${user.email}
        - Contraseña: Este campo es obligatorio y de tipo string.
    `
};

