import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { gmailTransporter } from '../config/gmail.config.js';


export const generateEmailWithToken = (email, expireTime) => {
    // Gereramos el token con el email y el tiempo de expiración.
    const token = jwt.sign({email}, config.gmail.secretToken, {expiresIn: expireTime});
    return token;
};

// Función para generar enlace con el token.
export const recoveryEmail = async (email, emailtoken) => {
    try {
        // Obtenemos el dominio del servidor para generar el enlace.
        const domain = `${req.protocol}://${req.get('host')}}`
        // Generamos el enlace con el token.
        const link = `${domain}/reset-password?token=${emailtoken}`;
        // Enviamos el email con el enlace.
        await gmailTransporter.sendMail({
            from: config.gmail.account,
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
                <h1>Recuperación de contraseña</h1>
                <p>Para recuperar tu contraseña, haz click en el siguiente enlace:</p>
                <a href="${link}">Reestablecer contraseña</a>
            `,
        });
    } catch (error) {
        console.log(`Error al enviar el email de recuperación de contraseña: ${error.message}`);
    }
}; 

