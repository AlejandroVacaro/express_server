import { Router } from "express";
import { usersService } from "../dao/index.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

// Rutas para la creación de usuarios
router.post("/signup", passport.authenticate('singupStrategy', {
    failureRedirect: '/api/sessions/fail-signup'
}), (req, res) => {
    res.render('login', { message: 'Usuario creado correctamente' });
});

router.get("/fail-signup", (req, res) => {
    res.render("signup", { error: "No se pudo registrar el usuario" });
});


// Rutas para el login de usuarios
router.post("/login", passport.authenticate('loginStrategy', {
    failureRedirect: '/api/sessions/fail-login'
}), (req, res) => {
    res.redirect('/home');
});

router.get("/fail-login", (req, res) => {
    res.render("login", { error: "No se pudo iniciar sesión" });
});


// Rutas para el signup con Github
router.get("/loginGithub", passport.authenticate("githubLoginStrategy"));

router.get("/github-callback", passport.authenticate("githubLoginStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), (req, res) => {
    res.redirect("/home");
});

// Rutas para el logout de usuarios
router.get("/logout", (req, res) => {
    //Eliminamos el req.user que crea Passport
    req.logOut(error => {
        if (error) {
            return res.render("profile", { user: req.user, error: "No se pudo cerrar la sesion" });
        } else {
            // Elimina la sesión de la base de datos
            req.session.destroy(error => {
                if (error) return res.render("profile", { user: req.user, error: "No se pudo cerrar la sesion" });
                    res.redirect("/");
            });
        }
    });
});

    export { router as sessionsRouter };