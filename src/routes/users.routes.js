import { Router } from 'express';
import { checkUserRole } from '../middlewares/auth.js';
import { UserController } from '../controllers/user.controller.js';
import { documentsUploader } from '../utils.js';

const router = Router();

// Ruta para modificar el rol de un usuario a premium
router.post ('/premium/:uid', checkUserRole('[admin]'), UserController.modifyRole);

// Ruta para cargar los documentos de un usuario
router.put ('/:uid/documents', documentsUploader.fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'domicilio', maxCount: 1 },
    { name: 'estadoDeCuenta', maxCount: 1 }
]), UserController.uploadDocuments);

export { router as usersRouter }