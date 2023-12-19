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

// Ruta para obtener todos los usuarios
router.get('/', checkUserRole('[admin]'), UserController.getAllUsers);

// Ruta para eliminar los usuarios que no hayan tenido actividad en los últimos 2 días
router.delete('/inactive', checkUserRole('[admin]'), UserController.deleteInactiveUsers);

// Ruta para eliminar un usuario
router.delete('/:uid', checkUserRole('[admin]'), UserController.deleteUser);

export { router as usersRouter }