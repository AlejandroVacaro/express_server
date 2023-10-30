import { Router } from "express";
import passport from "passport";
import { SessionsController } from "../controllers/sessions.controller.js";
import { validateUserInput } from "../middlewares/validateUserInput.js";

const router = Router();

// Rutas para la creación de usuarios
router.post("/signup", validateUserInput, passport.authenticate('singupStrategy', {
    failureRedirect: '/api/sessions/fail-signup'
}), SessionsController.redirectLogin);

// Rutas para los errores de creación de usuarios
router.get("/fail-signup", SessionsController.failSignup);

// Rutas para el login de usuarios
router.post("/login", passport.authenticate('loginStrategy', {
    failureRedirect: '/api/sessions/fail-login'
}), SessionsController.renderProfile);

// Rutas para los errores de login de usuarios
router.get("/fail-login", SessionsController.failLogin);

// Rutas para login y signup con Github
router.get("/loginGithub", passport.authenticate("githubLoginStrategy"));

// Rutas de callback de Github
router.get("/github-callback", passport.authenticate("githubLoginStrategy", {
    failureRedirect: "/api/sessions/fail-signup"
}), SessionsController.renderProfile);

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