import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import { usersService } from "../dao/index.js";
import githubStrategy from "passport-github2";
import { config } from "../config/config.js";

// Inicialización de passport
export const initializePassport = () => {
    passport.use('singupStrategy', new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        // Función para validar el login
        async (req, username, password, done) => {
            try {
                const { first_name } = req.body;
                const user = await usersService.getByEmail(username);
                // Verificamos si el usuario ya existe
                if (user) {
                    return done(null, false, { message: 'El usuario ya está registrado' });
                }
                // Creamos el nuevo usuario
                const newUser = {
                    first_name: first_name,
                    email: username,
                    password: await createHash(password),
                };
                // Guardamos el nuevo usuario en la base de datos
                const userCreated = await usersService.save(newUser);
                return done(null, userCreated);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Función para validar el login
    passport.use('loginStrategy', new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            try {
                const user = await usersService.getByEmail(username);
                // Verificamos si el usuario existe
                if (!user) {
                    return done(null, false, { message: 'El usuario no está registrado' });
                }   
                // Verificamos si la contraseña es válida
                if (isValidPassword(user, password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Credenciales inválidas' });
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Función para registrarse con Github
    passport.use('githubLoginStrategy', new githubStrategy(
        {
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
            } catch (error) {
                return done(error);
            }
        }
    ));


    // Serialización y deserialización del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getByID(id);
        done(null, user);
    });
};



