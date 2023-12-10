import dotenv from 'dotenv';
dotenv.config();

export const config = {

    //Configuración del puerto local.
    server: {
        port: process.env.PORT,
        secretSession: process.env.SECRET_SESSION,
    },

    //Configuración de la base de datos con MongoDB Atlas. 
    mongo: {
        url: process.env.MONGO_URL,
    },
    github: {
        clientID: "Iv1.1195ca1e01262dd0",
        clientSecret: "d285716e4e07c2c5429ee1ecba75a5c3a52bef2d",
        callbackURL: "http://localhost:8080/api/sessions/github-callback"
    },
    gmail: {
        account: process.env.GMAIL_USER,
        password: process.env.GMAIL_PASS,
        secretToken: process.env.SECRET_TOKEN,
    },  
};