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

}