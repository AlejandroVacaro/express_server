import { Router } from 'express';
import { checkUserRole } from '../middlewares/auth.js';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

router.post ('/premium/:uid', checkUserRole('[admin]'), UserController.modifyRole);

export { router as usersRouter }