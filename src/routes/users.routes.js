import { Router } from 'express';
import { checkUserRole } from '../middlewares/auth.js';
import { UserController } from '../controllers/user.controller.js';
import { documentsUploader } from '../utils.js';

const router = Router();

router.post ('/premium/:uid', checkUserRole('[admin]'), UserController.modifyRole);
router.put ('/:uid/documents', documentsUploader.fields([
    { name: 'identificacion', maxCount: 1 },
    { name: 'domicilio', maxCount: 1 },
    { name: 'estadoDeCuenta', maxCount: 1 }
]), UserController.uploadDocuments);

export { router as usersRouter }