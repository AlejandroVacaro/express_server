export const config = {

    //Configuración del puerto local.
    server: {
        port: 8080,
        secretSession: 'secretSessionKey'
    },

    //Configuración de la base de datos con MongoDB Atlas. 
    mongo: {
        url: "mongodb+srv://avacaro:coder@coderbackend.rf7x0pq.mongodb.net/ecomerceDB?retryWrites=true&w=majority"
    },
    github: {
        clientID: "Iv1.1195ca1e01262dd0",
        clientSecret: "d285716e4e07c2c5429ee1ecba75a5c3a52bef2d",
        callbackURL: "http://localhost:8080/api/sessions/github-callback"
    }
}