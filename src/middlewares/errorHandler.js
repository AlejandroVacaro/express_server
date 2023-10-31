import { EError } from '../enums/EError.js';

export const errorHandler = (error, req, res, next) => {
    console.log("Error received:", error);
    switch (error.code) {
        case EError.AUTH_ERROR:
            res.status(401).json({status: 'error', error: error.cause});
            break;
        case EError.INVALID_JSON:
            res.status(401).json({status: 'error', error: error.cause});
            break;
        case EError.DATABASE_ERROR:
            res.status(500).json({status: 'error', error: error.message});
            break;
        case EError.INVALID_PARAM:
            res.status(400).json({status: 'error', error: error.cause});
            break;
        default:
            res.status(500).json({status: 'error', error: 'Error desconocido'});
    };
};
