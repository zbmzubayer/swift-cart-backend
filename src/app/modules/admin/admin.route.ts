import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { adminController } from './admin.controller';
import { adminZodSchema } from './admin.validation';

const router = Router();

router.post('/', validateRequest(adminZodSchema.create), adminController.create);
router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.patch('/:id', validateRequest(adminZodSchema.update), adminController.update);
router.delete('/:id', adminController.remove);

export const adminRouter = router;
