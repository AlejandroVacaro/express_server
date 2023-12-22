import { UsersService } from "../services/users.service.js";
import { generateEmailWithToken, recoveryEmail } from "../utils/gmail.js";
import { validateToken, createHash, isValidPassword } from "../utils.js";
import { addLogger } from '../utils/loggers.js';

const logger = addLogger();

export class SessionsController {

    // Ruta para el login de usuarios
    static redirectLogin = (req, res) => {
        res.redirect("/");
    };

    // Ruta para intentos fallidos de signup
    static failSignup = (req, res) => {
        res.send("<p>Ocurrió un error al crear el usuario, <a href='/registro'>intenta nuevamente</a>.</p>");
    };

    // Ruta para renderizar la vista de perfil
    static renderProfile = (req, res) => {
        const isAdmin = req.user && req.user.role === 'admin';
        const profileView = {
            isAdmin: isAdmin,
            user: JSON.parse(JSON.stringify(req.user))
        }
        res.render("profile", profileView);
    };

    // Ruta para intentos fallidos de login
    static failLogin = (req, res) => {
        res.send("<p>Ocurrió un error al iniciar sesión, <a href='/'>intenta nuevamente</a>.</p>");
    };

    // Ruta para intentos fallidos de login con Github
    static failGithub = (req, res) => {
        res.send("<p>Ocurrió un error al iniciar sesión con Github, <a href='/'>intenta nuevamente</a>.</p>");
    };

    // Ruta para el logout de usuarios
    static logout = async (req, res) => {
        try {
            const user = req.user;
            user.last_connection = new Date();
            await UsersService.updateUser(user._id, user);
            await req.session.destroy();
            res.redirect("/");
        } catch (error) {
            logger.error(error);
            res.send("<p>Ocurrió un error al cerrar sesión, <a href='/'>intenta nuevamente</a>.</p>");
        }
    };

    // Ruta para solicitar reestablecer la contraseña
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await UsersService.getUserByEmail(email);
            // Verificamos si existe el usuario con ese email en la base de datos
            if (!user) {
                // Si no existe, enviamos un mensaje de error
                res.json({ status: 'error', message: 'No existe un usuario con ese email' })
            } else {
                // Si existe, generamos un token válido por una hora y enviamos el email
                const token = await generateEmailWithToken(email, '1h');
                await recoveryEmail(req, email, token);
                res.send('Se envió un email para reestablecer la contraseña. Por favor, revisa tu casilla de correo. <a href="/">Iniciar sesión</a>');
            }
        } catch (error) {
            res.json({ status: 'error', message: 'No se pudo reestablecer la contraseña' })
        }
    };

    // Ruta para reestablecer la contraseña
    static resetPassword = async (req, res) => {
        try {
            const token = req.query.token;
            const { newPassword } = req.body;
            const validEmail = validateToken(token);
            if (validEmail) {
                const user = await UsersService.getUserByEmail(validEmail);
                if (user) {
                    // Comprobar si la nueva contraseña es diferente a la actual
                    if (isValidPassword(user, newPassword)) {
                        return res.send('La nueva contraseña no puede ser la misma que la actual. <a href=\"/forgot-password\">Intentar de nuevo</a>');
                    }

                    user.password = createHash(newPassword);
                    await UsersService.updateUser(user._id, user);
                    res.send('Contraseña actualizada correctamente, <a href=\"/\">inicia sesión</a> con tu nueva contraseña');
                }
            } else {
                return res.send('El enlace para reestablecer la contraseña expiró. Por favor, solicita nuevamente el cambio de contraseña: <a href=\"/forgot-password\">Reestablecer contraseña</a>');
            }
        } catch (error) {
            res.send('No se pudo restablecer la contraseña. Por favor, solicita nuevamente el cambio de contraseña: <a href=\"/forgot-password\">Reestablecer contraseña</a>');
        }
    };

};