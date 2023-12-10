import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

// Creamos el transporter con los datos del correo que enviará el email.
const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmail.account,
        pass: config.gmail.password,
    },
    secure: false,
    tls: {
        rejectUnauthorized: false,
    },
});

export { gmailTransporter };