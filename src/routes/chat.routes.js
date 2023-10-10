import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { checkUserAuthenticated, checkUserRole } from '../middlewares/auth.js';

const router = Router();

// Ruta para enviar un mensaje al chat, solo para usuarios con rol 'user'
router.post('/message', checkUserAuthenticated, checkUserRole(['user']), ChatController.sendMessage);

// Ruta para obtener todos los mensajes del chat, solo para usuarios con rol 'user'
router.get('/messages', checkUserAuthenticated, checkUserRole(['user']), ChatController.getMessages);


export default router;
