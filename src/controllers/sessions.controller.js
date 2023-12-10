import { UsersService } from "../services/users.service.js";
import { generateEmailWithToken, recoveryEmail } from "../utils/gmail.js";

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
        res.render("profile", { user : JSON.parse(JSON.stringify(req.user)) });
    };

    // Ruta para intentos fallidos de login
    static failLogin = (req, res) => {
        res.send("<p>Ocurrió un error al iniciar sesión, <a href='/'>intenta nuevamente</a>.</p>");
    };

    // Ruta para intentos fallidos de login con Github
    static failGithub = (req, res) => {
        res.send("<p>Ocurrió un error al iniciar sesión con Github, <a href='/'>intenta nuevamente</a>.</p>");
    };

    // Ruta para reestablecer la contraseña
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await UsersService.getUserByEmail(email);
            console.log(user);
            // Verificamos si existe el usuario con ese email en la base de datos
            if (!user) {
                // Si no existe, enviamos un mensaje de error
                res.json({ status: 'error', message: 'No existe un usuario con ese email' })
            } else {
                // Si existe, generamos un token válido por una hora y enviamos el email
                const token = await generateEmailWithToken(email, '1h');
                await recoveryEmail(email, token);
                res.send('Se envió un email para reestablecer la contraseña');
            }
        } catch (error) {
            console.log(error);
            res.json({ status: 'error', message: 'No se pudo reestablecer la contraseña' })
        }
    };

}