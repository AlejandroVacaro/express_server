import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import githubStrategy from "passport-github2";
import { config } from "../config/config.js";
import { UsersService } from "../services/users.service.js";

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
                const { first_name, last_name } = req.body;
                const user = await UsersService.getUserByEmail(username);

                // Verificamos si el usuario ya existe
                if (user) {
                    return done(null, false, { message: 'El usuario ya está registrado' });
                }

                // Establecemos el rol user como predeterminado y admin si el correo termina en @coder
                let role = 'user';
                if (username.endsWith('@coder.com')) {
                    role = 'admin';
                }

                // Creamos el nuevo usuario
                const newUser = {
                    first_name: first_name,
                    last_name: last_name,
                    email: username,
                    password: await createHash(password),
                    role: role,
                    avatar: req.file.filename
                };

                // Guardamos el nuevo usuario en la base de datos
                const userCreated = await UsersService.saveUser(newUser);
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
                const user = await UsersService.getUserByEmail(username);
                // Verificamos si el usuario existe
                if (!user) {
                    return done(null, false, { message: 'El usuario no está registrado' });
                }
                // Verificamos si la contraseña es válida
                if (isValidPassword(user, password)) {
                    // Actualizamos la fecha de última conexión
                    user.last_connection = new Date();
                    await UsersService.updateUser(user._id, user);
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
                // Verificamos si el usuario ya existe
                const user = await UsersService.getUserByEmail(profile.username);
                if (!user) {
                    // Creamos el nuevo usuario
                    const newUser = {
                        first_name: profile.username,
                        last_name: profile.username,
                        email: profile.username,
                        password: await createHash(profile.id),
                    };
                    // Guardamos el nuevo usuario en la base de datos
                    const userCreated = await UsersService.saveUser(newUser);
                    return done(null, userCreated);
                } else {
                    return done(null, user);
                }
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
        const user = await UsersService.getUserById(id);
        done(null, user);
    });
};
