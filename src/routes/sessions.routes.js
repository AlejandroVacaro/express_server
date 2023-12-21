import { Router } from "express";
import passport from "passport";
import { SessionsController } from "../controllers/sessions.controller.js";
import { validateUserInput } from "../middlewares/validateUserInput.js";
import { CustomError } from "../services/error/customError.service.js";
import { invalidParamMsg } from "../services/error/invalidParamError.service.js";
import { EError } from "../enums/EError.js";
import { profileUploader } from "../utils.js";

const router = Router();

// Rutas para la creación de usuarios
router.post("/signup", profileUploader.single('avatar'), validateUserInput, passport.authenticate('singupStrategy', {
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
router.get("/logout", SessionsController.logout);

// Ruta para obtener un usuario por el id
router.get("/:uid", (req, res, next) => {
    const uid = req.params.uid;
    const userId = parseInt(uid);

    if (Number.isNaN(userId)) {
        const error = CustomError.createError({
            name: 'userById error',
            cause: invalidParamMsg(uid),
            message: 'Datos invalidos para buscar el usuario',
            errorCode: EError.INVALID_PARAM
        });
        return next(error);
    }

    res.json({ status: 'success', message: 'Usuario encontrado' });
});

// Ruta para solicitar el cambio de contraseña
router.post('/forgot-password', SessionsController.forgotPassword);

// Ruta para reestablecer la contraseña
router.post('/reset-password', SessionsController.resetPassword);

export { router as sessionsRouter };
