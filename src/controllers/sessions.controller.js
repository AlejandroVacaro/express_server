export class SessionsController {

    // Rutas para la creación de usuarios
    static redirectLogin = (req, res) => {
        res.redirect("/");
    };

    // Rutas para el login de usuarios
    static failSignup = (req, res) => {
        res.send("<p>Ocurrió un error al crear el usuario, <a href='/registro'>intenta nuevamente</a>.</p>");
    };

    // Rutas para el logout de usuarios
    static renderProfile = (req, res) => {
        res.render("profile", { user: req.user });
    };

    // Rutas para el logout de usuarios
    static failLogin = (req, res) => {
        res.send("<p>Ocurrió un error al iniciar sesión, <a href='/'>intenta nuevamente</a>.</p>");
    };

    // Rutas para el logout de usuarios
    static failGithub = (req, res) => {
        res.send("<p>Ocurrió un error al iniciar sesión con Github, <a href='/'>intenta nuevamente</a>.</p>");
    };

}